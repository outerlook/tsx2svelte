import * as parser from '@babel/parser';
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import * as t from '@babel/types';
import {codeFrameColumns} from '@babel/code-frame'
import { buildHtmlxNode } from "./astHelpers";


export function compile(code: string) {
    const ast = parser.parse(code, {sourceType: 'module', plugins: ['jsx', 'typescript']});

    // * processing functions
    const compiledStateBodyNodePaths = [];


    let useState = 'useState';
    const stateVariables = {
        /* setterFunctionName, decNode */
    };
    const setterFunctions = {};
    const builtSetterFunctions = [];
    const excludedBodyPaths = [];
    const variablesParsedSoFar = {};

    function processState(idPath, funcPath) {
        // TODO: detect aliases
        const isStateVariable = stateVariables[idPath.node.name] !== undefined;
        if (isStateVariable) {
            let parentDec = idPath.findParent(t.isVariableDeclaration);
            let isStateDeclaration =
                parentDec &&
                stateVariables[idPath.node.name].decNode === parentDec.node;
            if (isStateDeclaration) {
                // Don't replace state declaration. After useState is replaced with VariableDeclaration,
                // it is immediately revisited, we do not want to replace it
                return false;
            }

            const isInDeclarator = idPath.findParent(t.isVariableDeclarator);
            const isInAssngmt = idPath.findParent(t.isAssignmentExpression);

            if (isInDeclarator || isInAssngmt) {
                const varNames = getVariablesNames(isInDeclarator || isInAssngmt);

                varNames.forEach((varName) => {
                    stateVariables[varName] = {
                        setterFunctionName: null,
                        decNode: null,
                    };
                });
            }

            const {
                parentToBeReplaced,
                reactiveLabel,
            } = getReactiveNodeForIdentifier(
                idPath,
                funcPath,
                compiledStateBodyNodePaths
            );
            if (parentToBeReplaced) parentToBeReplaced.replaceWith(reactiveLabel);
            return true;
        }

        // TODO: setter functions
        const isSetter = setterFunctions[idPath.node.name] !== undefined;
        if (isSetter) {
            const {callExprPath, asnExpr} = getAsmntNodeForSetter(
                idPath,
                setterFunctions[idPath.node.name]
            );

            if (!callExprPath) {
                const funcDecl = buildSetterFunction(
                    setterFunctions[idPath.node.name],
                    idPath.node.name
                );
                builtSetterFunctions.push(funcDecl);
                return true;
            }

            callExprPath.replaceWith(asnExpr); // ! replace the function call
            const hasLabeledParent = callExprPath.findParent(t.isLabeledStatement);
            const isInsideFuncDecl = callExprPath.findParent(t.isFunction);

            // ? function declarations
            // ? return statement
            if (!hasLabeledParent && !isInsideFuncDecl) {
                const bodyNodePath = getComponentBodyPath(idPath, funcPath);
                const labeledStatement = t.labeledStatement(
                    t.identifier('$'),
                    bodyNodePath.node
                );

                // ! if necessary, replace containing statement with a reactive one
                bodyNodePath.replaceWith(labeledStatement);
            }
        }

        let callExpr = idPath.findParent(t.isCallExpression);
        if (callExpr && isCallToBuiltInHook(callExpr, 'useState')) {
            const {
                vDeclaration,
                stateVariableName,
                setterFunctionName,
            } = getDeclarationForUseState(callExpr);

            if (vDeclaration) {
                const bodyNode = getComponentBodyPath(idPath, funcPath);
                bodyNode.replaceWith(vDeclaration);

                stateVariables[stateVariableName] = {
                    setterFunctionName,
                    decNode: vDeclaration,
                };
                setterFunctions[setterFunctionName] = stateVariableName;
                compiledStateBodyNodePaths.push(vDeclaration);
                return true;
            }

            // TODO: non-destructured pattern
        }

        return false;
    }

    const jsxVariables = {};

    function processJSXVariable(idPath) {
        const isRefToJSXVar = jsxVariables[idPath.node.name];
        const isBeingReturned =
            idPath.container && idPath.container.type === 'ReturnStatement';
        const isRefedInJSXExpression = idPath.findParent(
            t.isJSXExpressionContainer
        );

        if (!isRefToJSXVar || (!isBeingReturned && !isRefedInJSXExpression)) {
            // * noop
            return false;
        }

        idPath.replaceWith(jsxVariables[idPath.node.name]);
        return true;
    }

    // * main
    let scriptNodes = [];
    const jsxElements = {mainJSXElementPath: {}, others: {}};
    let htmlxCode = '';
    const allJSXReturns = [];

    const defaultExport = {};

    traverse(ast, {
        CallExpression(callExprPath) {
            if (isCallToBuiltInHook(callExprPath, 'memo')) {
                const firstArg = callExprPath.get('arguments.0');

                callExprPath.replaceWith(firstArg);
                return;
            }
        },
    });

    const exportDetectionPlugin = {
        ExportDefaultDeclaration(exportPath) {
            switch (exportPath.node.declaration.type) {
                case 'Identifier':
                    defaultExport.id = exportPath.get('declaration');
                    break;
                case 'FunctionDeclaration':
                case 'ArrowFunctionExpression':
                    defaultExport.function = exportPath.get('declaration');
                    break;
                case 'AssignmentExpression':
                    if (
                        exportPath.node.declaration.right.type !== 'FunctionDeclaration' &&
                        exportPath.node.declaration.right.type !== 'ArrowFunctionExpression'
                    ) {
                        const expMsg = getErrorCodeFrame(
                            exportPath,
                            'Input file has to export a function that returns JSX'
                        );
                        throw Error(expMsg);
                    }
                    defaultExport.function = exportPath.get('declaration.right');
                    break;
                default:
                    const expMsg = getErrorCodeFrame(
                        exportPath,
                        'Input file has to export a function that returns JSX'
                    );
                    throw Error(expMsg);
                    break;
            }

            excludedBodyPaths.push(exportPath);
        },
        ImportDeclaration(importPath) {
            if (importPath.node.source.value === 'react') {
                return;
            }

            scriptNodes.push(importPath.node);
        },
    };

    traverse(ast, exportDetectionPlugin);

    if (defaultExport.id) {
        const findComponentFunctionPlugin = {
            VariableDeclarator(vdPath) {
                if (
                    vdPath.node.id.name !== defaultExport.id.node.name ||
                    vdPath.parentPath.parentPath.type !== 'Program'
                ) {
                    return;
                }

                if (
                    vdPath.node.init.type !== 'FunctionExpression' &&
                    vdPath.node.init.type !== 'ArrowFunctionExpression'
                ) {
                    const expMsg = getErrorCodeFrame(
                        defaultExport,
                        'Input file has to export a function that returns JSX'
                    );
                    throw Error(expMsg);
                }
                excludedBodyPaths.push(vdPath.parentPath);
                defaultExport.function = vdPath.get('init');
            },
            AssignmentExpression(asmntPath) {
                if (
                    asmntPath.node.left.name !== defaultExport.id.node.name ||
                    asmntPath.parentPath.parentPath.type !== 'Program'
                ) {
                    return;
                }

                if (
                    asmntPath.node.right.type !== 'FunctionExpression' &&
                    asmntPath.node.right.type !== 'ArrowFunctionExpression'
                ) {
                    const expMsg = getErrorCodeFrame(
                        defaultExport,
                        'Input file has to export a function that returns JSX'
                    );
                    throw Error(expMsg);
                }
                excludedBodyPaths.push(asmntPath.parentPath);
                defaultExport.function = asmntPath.get('right');
            },
            FunctionDeclaration(funcPath) {
                if (
                    funcPath.node.id.name !== defaultExport.id.node.name ||
                    funcPath.parentPath.type !== 'Program'
                ) {
                    return;
                }
                excludedBodyPaths.push(funcPath);
                defaultExport.function = funcPath;
            },
        };
        traverse(ast, findComponentFunctionPlugin);
    }

    if (!defaultExport.function) {
        throw Error('Input file has to export a function that returns JSX');
    }

    const propsNames = getPropNames(defaultExport.function);

    // * add export statement for each prop
    propsNames.forEach((propName) => {
        if (!propName.startsWith('$$'))
            scriptNodes.push(getExportNodeForProp(propName));
    });

    const listMaps = [];
    const funcPath = defaultExport.function;
    traverse(ast, {
        Program(rootPath) {
            const bodyLen = rootPath.get('body').length;
            // const bodyArr = rootPath.get('body').node

            for (let i = 0; i < bodyLen; i++) {
                let bodyNodePath = rootPath.get('body.' + i);

                if (
                    bodyNodePath.type === 'ImportDeclaration' ||
                    excludedBodyPaths.find((exclPath) => bodyNodePath === exclPath)
                ) {
                    continue;
                } else {
                    let declNames = getDeclarationNames(bodyNodePath);

                    if (declNames.length) {
                        // variablesOutsideComponent
                        declNames.forEach(
                            (dec) => (variablesParsedSoFar[dec.name] = dec.path)
                        );
                    }

                    if (bodyNodePath.type === 'ExportNamedDeclaration') {
                        if (!bodyNodePath.node.declaration) {
                            continue;
                        }

                        bodyNodePath = bodyNodePath.get('declaration');
                    }
                    scriptNodes.push(bodyNodePath.node);
                }
            }
        },
        // ! throws if JSX is found inside a loop, conditional body or a function
        // !   that is not a callback to list.map
        JSXElement(jsxPath) {
            // !throw if inside loop
            const isInLoop = jsxPath.findParent((path) => {
                return (
                    t.isForXStatement(path) || t.isForStatement(path) || t.isWhile(path)
                );
            });

            if (isInLoop) {
                const msg = getErrorCodeFrame(
                    jsxPath,
                    'JSX inside loops cannot be compiled'
                );
                throw Error(msg);
            }

            // ! throw if inside conditional
            const isInConditional = jsxPath.findParent(t.isConditional);
            const isInJSXExpression =
                isInConditional &&
                isInConditional.container.type === 'JSXExpressionContainer';
            if (isInConditional && !isInJSXExpression) {
                const errMsg = getErrorCodeFrame(
                    jsxPath,
                    'JSX inside conditionals cannot be compiled'
                );
                throw Error(errMsg);
            }

            // ! throw if inside a function
            const funcDecl = jsxPath.findParent(t.isFunction);
            const callExpr = jsxPath.findParent(t.isCallExpression);

            const funcIsInComponentBody = funcDecl === funcPath;
            const funcIsCallbackPassedToListMap =
                callExpr &&
                callExpr.node.callee.type === 'MemberExpression' &&
                callExpr.node.callee.property.name === 'map';

            if (
                funcDecl &&
                !funcIsInComponentBody &&
                !funcIsCallbackPassedToListMap
            ) {
                const errMsg = getErrorCodeFrame(
                    jsxPath,
                    'It seems like you have a JSX element inside a function that is not the exported function. This cannot be compiled.'
                );
                throw Error(errMsg);
            }
        },
        // ! modifies the jsxVariables object
        VariableDeclarator(declaratorPath) {
            const varName = declaratorPath.node.id.name;
            const val = declaratorPath.node.init;

            if (val && val.type === 'JSXElement') {
                jsxVariables[varName] = declaratorPath.get('init');
            }
        },
        // ! modifies the jsxVariables object
        AssignmentExpression(assignmentPath) {
            const varName = assignmentPath.node.left.name;
            const val = assignmentPath.node.right;

            if (val && val.type === 'JSXElement') {
                jsxVariables[varName] = assignmentPath.get('right');
            }
        },
    });

    const namedImportsFromSvelte = {};

    funcPath.get('body').traverse({
        JSXAttribute(attrPath) {
            // replace on<Event> attrs. E.g. onClick -> on:click
            const attrName = attrPath.node.name.name;
            const eventAttr = /^on([a-z]+)$/i.exec(attrName);

            if (attrName === 'className') {
                attrPath.get('name').replaceWith(t.jsxIdentifier('class'));
                return;
            }

            if (eventAttr) {
                const eventName = eventAttr[1];

                const newAttrName = t.jsxNamespacedName(
                    t.jsxIdentifier('on'),
                    t.jsxIdentifier(eventName.toLowerCase())
                );

                attrPath.get('name').replaceWith(newAttrName);
            }
        },
    });

    funcPath.get('body').traverse({
        // ! replace call to `list.map` with <HTMLxBlock> JSX element
        CallExpression(callExprPath) {
            const callNode = callExprPath.node;

            if (isCallToBuiltInHook(callExprPath, 'useEffect')) {
                const firstArg = callNode.arguments[0];
                if (
                    firstArg.type !== 'FunctionExpression' &&
                    firstArg.type !== 'ArrowFunctionExpression'
                ) {
                    const msg = getErrorCodeFrame(
                        callExprPath,
                        'The first argument passed to useEffect must be a function expression.'
                    );
                    throw Error(msg);
                }

                // cleanup
                const returnVal = getReturnVal(callExprPath.get('arguments.0'));
                if (returnVal) {
                    // onDestroy
                    if (t.isFunction(returnVal) || t.isIdentifier(returnVal)) {
                        namedImportsFromSvelte.onDestroy = true;
                        const onDestroyCall = t.callExpression(t.identifier('onDestroy'), [
                            returnVal.node,
                        ]);
                        callExprPath.insertAfter(onDestroyCall);
                        const pathToRemove = removeReturn(callExprPath.get('arguments.0'));
                        if (pathToRemove) {
                            pathToRemove.remove();
                        }

                        if (pathToRemove.node === callExprPath.node) {
                            return;
                        }
                    } else {
                        const msg = getErrorCodeFrame(
                            callExprPath,
                            'Cleanup function must be returned as a function expression.'
                        );
                        throw Error(msg);
                    }
                }

                if (isOnMount(callExprPath.get('arguments'))) {
                    // import for onMount
                    namedImportsFromSvelte.onMount = true;

                    // call expression, onMount(cb)
                    callExprPath.get('callee').replaceWith(t.identifier('onMount'));
                    callExprPath.set('arguments', [callExprPath.get('arguments.0').node]);
                    return;
                }

                if (isAfterUpdate(callExprPath.get('arguments'))) {
                    namedImportsFromSvelte.afterUpdate = true;

                    callExprPath.get('callee').replaceWith(t.identifier('afterUpdate'));
                    callExprPath.set('arguments', [callExprPath.get('arguments.0').node]);
                    return;
                }

                return;
            }

            if (isCallToBuiltInHook(callExprPath, 'useCallback')) {
                const firstArg = callExprPath.get('arguments.0');

                callExprPath.replaceWith(firstArg);
                return;
            }

            if (isCallToBuiltInHook(callExprPath, 'useMemo')) {
                const firstArg = callNode.arguments[0];
                if (
                    firstArg.type !== 'FunctionExpression' &&
                    firstArg.type !== 'ArrowFunctionExpression'
                ) {
                    const msg = getErrorCodeFrame(
                        callExprPath,
                        'The first argument passed to useMemo must be a function expression, not a reference to a function.'
                    );
                    throw Error(msg);
                }

                const returnVal = getReturnVal(callExprPath.get('arguments.0'));
                if (returnVal) {
                    // onDestroy
                    callExprPath.replaceWith(returnVal);
                    return;
                }
            }

            if (isCallToBuiltInHook(callExprPath, 'useReducer')) {
                const msg = getErrorCodeFrame(
                    callExprPath,
                    'useReducer not suppported yet'
                );
                throw Error(msg);
            }
        },
        // ! props and state processing, JSX variable inlining
        Identifier(idPath) {
            const propsProcessed = processProps(idPath, funcPath, propsNames); // ! Side Effect: modifies AST
            if (propsProcessed) return;

            // ! modifies AST: replace `useState` call with declarations
            // ! Replace state access and setterfunc call with reactive variables
            let useStateReplaced = processState(idPath, funcPath);
            if (useStateReplaced) return;

            // ! modifies AST: replace references to variables with JSX values with inline JSX
            // let jsxRemoved = processJSXVariable(idPath, funcPath);
            // if (jsxRemoved) return;
        },
    });

    funcPath.get('body').traverse({
        VariableDeclarator(declaratorPath) {
            const varName = declaratorPath.node.id.name;
            const val = declaratorPath.node.init;

            if (
                val &&
                val.type === 'JSXElement' &&
                val.openingElement.name.name === 'HTMLxBlock'
            ) {
                jsxVariables[varName] = declaratorPath.get('init');
            }
        },
        AssignmentExpression(assignmentPath) {
            const varName = assignmentPath.node.left.name;
            const val = assignmentPath.node.right;

            if (
                val &&
                val.type === 'JSXElement' &&
                val.openingElement.name.name === 'HTMLxBlock'
            ) {
                jsxVariables[varName] = assignmentPath.get('right');
            }
        },
        Identifier(idPath) {
            processJSXVariable(idPath, funcPath);
        },
    });

    traverse(ast, {
        CallExpression(callExprPath) {
            const callNode = callExprPath.node;

            if (
                callNode.callee.type === 'MemberExpression' &&
                callNode.callee.property.name === 'map'
            ) {
                const callback = callNode.arguments[0];
                const objName = callNode.callee.object.name;
                const elementName = callback.params[0].name;
                let keyAttrPath;
                let jsxElem = {};

                if (callback.body.type === 'JSXElement') {
                    jsxElem = callback.body;
                } else if (
                    callback.body.type === 'BlockStatement' &&
                    callback.body.body[0].type === 'ReturnStatement' &&
                    callback.body.body[0].argument.type === 'JSXElement'
                ) {
                    jsxElem = callback.body.body[0].argument;
                } else {
                    return;
                }

                keyAttrPath = getKeyAttrPath(callExprPath);
                const keyCode = generate(keyAttrPath.node.value.expression, {}).code;
                keyAttrPath.remove();
                const loopCodeString = getListMapCode({
                    objName,
                    elementName,
                    jsxElem,
                    key: keyCode,
                });
                const loopJSXElem = buildHtmlxNode(loopCodeString); // HTMLxBlock
                // console.log(generate(loopJSXElem).code);
                const jsxExpr = callExprPath.findParent(t.isJSXExpressionContainer);
                if (jsxExpr) {
                    jsxExpr.replaceWith(loopJSXElem);
                } else {
                    callExprPath.replaceWith(loopJSXElem);
                }

                listMaps.push({objName, elementName, jsxElem, keyAttrPath});
                return;
            }
        },
        LogicalExpression(condPath) {
            // inline conditional expression {condition && <JSXElement />}
            const jsxContainer = condPath.findParent(t.isJSXExpressionContainer);
            const jsxOpeningElem = condPath.findParent(t.isJSXOpeningElement);
            if (jsxContainer && !jsxOpeningElem) {
                const jsx = generate(condPath.get('right').node, {comments: false})
                    .code;

                // condPath.get('right').remove();
                const condition = generate(condPath.get('left').node, {
                    comments: false,
                }).code;

                const svelteIfStatementCode =
                    '{#if ' + condition + '}\n' + jsx + '\n' + '{/if}';

                const htmlxBlock = buildHtmlxNode(svelteIfStatementCode);

                jsxContainer.replaceWith(htmlxBlock);
            }
        },
        ConditionalExpression(condPath) {
            const jsxContainer = condPath.findParent(t.isJSXExpressionContainer);
            const jsxOpeningElem = condPath.findParent(t.isJSXOpeningElement);
            if (jsxContainer && !jsxOpeningElem) {
                const testCode = generate(condPath.get('test').node, {}).code;
                const consequentCode = generate(condPath.get('consequent').node, {})
                    .code;
                const alternateCode = generate(condPath.get('alternate').node, {}).code;

                const svelteIfElseStatementCode =
                    '{#if ' +
                    testCode +
                    '}\n' +
                    consequentCode +
                    '\n' +
                    '{:else}\n' +
                    alternateCode +
                    '\n{/if}\n';
                const htmlxBlock = buildHtmlxNode(svelteIfElseStatementCode);
                const jsxExprContainer = condPath.findParent(
                    t.isJSXExpressionContainer
                );
                jsxExprContainer.replaceWith(htmlxBlock);
            }
        },
    });

    funcPath.get('body').traverse({
        ReturnStatement(returnPath) {
            if (returnPath.node.argument.type === 'JSXElement') {
                htmlxCode = generate(returnPath.node.argument, {comments: false})
                    .code;
                returnPath.remove();
            }
        },
    });

    if (Object.keys(namedImportsFromSvelte).length) {
        const svelteImport = buildNamedImportNode(
            Object.keys(namedImportsFromSvelte),
            'svelte'
        );

        scriptNodes.unshift(svelteImport);
    }

    // ! modifies AST: remove all JSX assignments to variables
    Object.values(jsxVariables).forEach((jsxVariable) => {
        const bodyPath = getComponentBodyPath(jsxVariable, funcPath);
        bodyPath && bodyPath.remove();
    });

    scriptNodes = scriptNodes.concat(funcPath.node.body.body);

    let out = '<script>\n';

    scriptNodes.forEach((node) => {
        out += '  ' + generate(node, {comments: false}).code + '\n\n';
    });

    builtSetterFunctions.forEach((func) => {
        out += '  ' + generate(func, {comments: false}).code + '\n\n';
    });

    out += '</script>\n\n';

    out += htmlxCode;

    out = out.replace(/<HTMLxBlock>{"/g, '');
    out = out.replace(/"}<\/HTMLxBlock>/g, '');
    out = out.replace(/\\n/g, '\n');
    out = out.replace(/\\r/g, '\r');
    out = out.replace(/<\/?Fragment>/g, '');
    out = out.replace(/\\"/g, '"');

    return out;
}

