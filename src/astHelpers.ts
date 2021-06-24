import * as t from "@babel/types";
import { ArrowFunctionExpression, FunctionDeclaration } from "@babel/types";
import { codeFrameColumns } from "@babel/code-frame";
import generate from "@babel/generator";
import traverse, { Node, NodePath } from "@babel/traverse";
import { O } from "ts-toolbelt";
import { PossibleReactFunctions } from "./svelte-helpers/react/utils";
import { getCode } from "./compileHelpers";
import {FileOrProgram} from "./astHelpers/astTypes";

export function getAllExportsFromCode(ast: FileOrProgram) {
  const paths: NodePath<t.ExportDeclaration>[] = [];
  traverse(ast, {
    ExportDeclaration: (path) => {
      paths.push(path);
    },
  });
  return paths;
}

export function checkIfTargetJSXComponent(functionPath) {
  const funcName = functionPath.node.id.name;

  const programPath = functionPath.findParent(t.isProgram);
  const exportNode = programPath.node.body.find(
    (code) => code.type === "ExportDefaultDeclaration"
  );

  if (exportNode.declaration.name !== funcName) {
    return false;
  }

  // Remove ReturnStatement from BlockStatement
  const funcCodeBlock = functionPath.node.body.body;
  const blockLen = funcCodeBlock.length;
  const lastElement = funcCodeBlock[blockLen - 1];

  if (lastElement.type !== "ReturnStatement") {
    throw SyntaxError(
      "The return statement should be at the end of the function."
    );
  } else if (lastElement.argument.type !== "JSXElement") {
    throw SyntaxError(
      "The default exported function should return a JSX element."
    );
  }

  return true;
}

export function getErrorCodeFrame(path: NodePath<any>, message: string, code: string) {
  const expMsg = codeFrameColumns(
    code,
    path.node.loc,
    // { start: path.node.loc.start },
    { message }
  );

  return expMsg;
}

export function getComponentBodyPath(componentFuncPath: NodePath<PossibleReactFunctions>) {
  return componentFuncPath.get('body')
}

export function getVariablesNames(path: NodePath<t.VariableDeclarator | t.AssignmentExpression>) {
  const out = [];
  if (path.type === "VariableDeclarator") {
    const idPath = path.get("id");
    if (idPath.isObjectPattern()) {
    // if (idPath.type === "ObjectPattern") {
      const propertiesPath = path.get("id.properties");
      const len = propertiesPath.length;

      for (let i = 0; i < len; i++) {
        out.push(propertiesPath[i].get(`key.name`).node);
      }
    } else {
      out.push(path.get("id.name").node);
    }
  } else if (path.isAssignmentExpression()) {
  // } else if (path.type === "AssignmentExpression") {
    out.push(path.get("left").get('name').node);
  }

  return out;
}

export const createReactiveDeclarationForIdentifier = (identifier: t.Identifier, expression: t.Expression)  => {
  const asnExp = t.assignmentExpression(
      "=",
      identifier,
      expression
  );
  const exprStmnt = t.expressionStatement(asnExp);
  return createReactiveStatement(exprStmnt);
}

export const createReactiveStatement = (statement: t.Statement) => {
  const $ = t.identifier("$"); // label
  return t.labeledStatement($, statement);
}


export function getReactiveNodeForIdentifierOld(
  identifierPath: NodePath<t.Identifier>,
  componentFuncPath: NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression>,
) {
  // propUsed = true;
  const $ = t.identifier("$"); // label

  // // Not reactive if passed as initial value to useState
  // const callExpr = identifierPath.findParent(t.isCallExpression);
  // if (callExpr && callExpr.node.callee.name === "useState") {
  //   return { parentToBeReplaced: null, reactiveLabel: null };
  // }

  // const alreadyReactive = identifierPath.findParent(t.isLabeledStatement);
  // if (alreadyReactive) {
  //   return { parentToBeReplaced: null, reactiveLabel: null };
  // }

  // const parentFunctionPath = identifierPath.getFunctionParent();
  // const isNestedFunction = parentFunctionPath !== componentFuncPath;
  // if (isNestedFunction) {
  //   return { parentToBeReplaced: null, reactiveLabel: null };
  // }

  // TODO: handle conditional rendering
  // const isReturn = identifierPath.findParent(t.isReturnStatement);
  // if (isReturn) {
  //   return { parentToBeReplaced: null, reactiveLabel: null };
  // }

  let componentBodyPath = getComponentBodyPath(
    componentFuncPath
  );

  let reactiveLabel = null;
  const bodyNode = componentBodyPath?.node;

  if (bodyNode) {
  // if (bodyNode && !compiledStatePaths.includes(bodyNode)) {
    if (bodyNode.type === "VariableDeclaration") {
      const declaration = bodyNode.declarations[0];
      if (!declaration.init) throw new Error("Don't work")
      const asnExp = t.assignmentExpression(
        "=",
        declaration.id,
        declaration.init
      );
      const exprStmnt = t.expressionStatement(asnExp);
      reactiveLabel = t.labeledStatement($, exprStmnt);
    } else if (t.isStatement(bodyNode)) {
      reactiveLabel = t.labeledStatement($, bodyNode);
    } else {
      componentBodyPath = null;
    }
  } else {
    componentBodyPath = null;
  }

  return { parentToBeReplaced: componentBodyPath, reactiveLabel };
}

export function getExportLetNodeForProp(propName: string) {
  const identifier = t.identifier(propName);
  const vDeclarator = t.variableDeclarator(identifier);
  const vDeclaration = t.variableDeclaration("let", [vDeclarator]);
  const namedExport = t.exportNamedDeclaration(vDeclaration, [], null);

  return namedExport;
}

// !replaces identifier param with '$$props'
export function replacePropNames(funcPath: NodePath<ArrowFunctionExpression | FunctionDeclaration>) {
  const params = funcPath.node.params;
  const hasProps = !!params.length;
  const propsObject = params[0];
  let props: any[] = [];

  if (!hasProps) {
    return props;
  }

  if (propsObject.type === "ObjectPattern") {
    props = propsObject.properties.map((objProp) => objProp.value.name);
  } else if (propsObject.type === "Identifier") {
    props = ["$$props"];
    const propsContainerObjName = propsObject.name;

    funcPath.get("body").traverse({
      Identifier(idPath) {
        if (idPath.node.name === propsContainerObjName) {
          idPath.replaceWith(t.identifier("$$props"));
        }
      },
      VariableDeclarator(declPath) {
        if (
          declPath.node.init?.name !== propsContainerObjName ||
          declPath.node.id.type !== "ObjectPattern"
        ) {
          return;
        }

        props = props.concat(
          declPath.node.id.properties.map((objProp) => objProp.value.name)
        );
      },
    });
  }

  return props;
}

export function getDeclarationForUseState(callExprPath) {
  const lVal = callExprPath.container.id;
  let vDeclaration = null;
  let setterFunctionName = null;
  let stateVariableName = null;

  if (lVal.type === "ArrayPattern") {
    // array destructured form
    stateVariableName = lVal.elements[0].name;
    setterFunctionName = lVal.elements[1].name;

    const argNode = callExprPath.node.arguments[0];

    const vDectr = t.variableDeclarator(
      t.identifier(stateVariableName),
      argNode
    );

    vDeclaration = t.variableDeclaration("let", [vDectr]);
  }

  return { vDeclaration, stateVariableName, setterFunctionName };
}

export function getAsmntNodeForSetter(idPath, stateVariableName, funcPath) {
  let out = { callExprPath: null, asnExpr: null };
  const callExprPath = idPath.findParent(t.isCallExpression);

  if (!callExprPath) {
    return out;
  }

  const firstArgPath = callExprPath.get("arguments.0");
  let rhs = null;
  const stateId = t.identifier(stateVariableName);

  if (t.isFunction(firstArgPath)) {
    rhs = t.callExpression(firstArgPath.node, [stateId]);
  } else {
    rhs = firstArgPath.node;
  }
  const asnExpr = t.assignmentExpression("=", stateId, rhs);
  // callExpr.replaceWith(asnExpr);

  return { callExprPath, asnExpr };
}

export function buildSetterFunction(stateName, setterName) {
  return t.functionDeclaration(
    t.identifier(setterName),
    [t.identifier("value")],
    t.blockStatement([
      t.expressionStatement(
        t.assignmentExpression(
          "=",
          t.identifier(stateName),
          t.identifier("value")
        )
      ),
    ])
  );
}

export function getContainingFunction(path) {
  const func = path.getFunctionParent() || {};
  const name = null;

  if (
    func.type === "FunctionExpression" ||
    func.type === "ArrowFunctionExpression"
  ) {
    if (func.container.type === "VariableDeclarator") {
      name = func.container.id.name;
    } else if (func.container.type === "AssignmentExpression") {
      name = func.container.left.name;
    }
  } else if (func.type === "FunctionDeclaration") {
    name = func.id.name;
  }

  return { name, path: func };
}

export function isCallToBuiltInHook(callExprPath, hookName) {
  const callee = callExprPath.node.callee;

  if (callee.type === "Identifier" && callee.name === hookName) {
    return true;
  } else if (
    callee.type === "MemberExpression" &&
    callee.object.name === "React" &&
    callee.property.name === hookName
  ) {
    return true;
  }

  return false;
}

export function getDeclarationNames(bodyNodePath: NodePath<t.Program>) {
  let decl: {
    name: string;
    path:
      | NodePath<t.FunctionDeclaration>
      | NodePath<t.Expression | null | undefined>
      | NodePath<t.Expression>;
  }[] = [];

  bodyNodePath.traverse({
    VariableDeclarator(declPath) {
      decl.push({
        name: declPath.node.id.name,
        path: declPath.get("init"),
      });
    },
    AssignmentExpression(asmntPath) {
      decl.push({
        name: asmntPath.node.left.name,
        path: asmntPath.get("right"),
      });
    },
    FunctionDeclaration(funcPath) {
      decl.push({
        name: funcPath.node.id.name,
        path: funcPath,
      });
    },
  });

  return decl;
}

// useEffect() helpers
export function isOnMount(argsPath) {
  const args = argsPath;

  if (
    args.length >= 2 &&
    args[1].node.type === "ArrayExpression" &&
    args[1].node.elements.length === 0
  ) {
    return true;
  }

  return false;
}

export function buildNamedImportNode(specifiers, source) {
  const specifierNodes = specifiers.map((sp) => {
    return t.importSpecifier(t.identifier(sp), t.identifier(sp));
  });

  return t.importDeclaration(specifierNodes, t.stringLiteral(source));
}

export function getReturnVal(callBackPath: NodePath<PossibleReactFunctions>) {
  let retVal = null;

  const bodyPath = callBackPath.get("body");
  if (!bodyPath.isBlockStatement()) {
    retVal = bodyPath;
    return retVal;
  }

  bodyPath.traverse({
    ReturnStatement(retPath) {
      retVal = retPath.get("argument");
    },
  });

  return retVal;
}

export function isAfterUpdate(argsPath) {
  if (argsPath.length === 2) {
    if (
      argsPath[1].node.type === "ArrayExpression" &&
      argsPath[1].node.elements.length > 0
    )
      return true;
  } else if (argsPath.length === 1) {
    return true;
  }

  return false;
}

export function removeReturn(callbackPath: NodePath<PossibleReactFunctions>) {
  let ret = null;
  const callbackBody = callbackPath.node.body;

  if (callbackBody.type !== "BlockStatement") {
    return callbackPath.findParent(t.isCallExpression);
  }

  callbackPath.traverse({
    ReturnStatement(retPath) {
      ret = retPath;
    },
  });

  return ret;
}

// * list map helpers
export function getListMapCode({ objName, elementName, jsxElem, key }) {
  const out = `{#each ${objName} as ${elementName} (${key})}${
    generate(jsxElem, {}).code
  }{/each}`;
  // keyNode.remove();

  return out;
}

export function getKeyAttrPath(callExprPath) {
  let keypath = null;
  callExprPath.traverse({
    JSXAttribute(jsxAttrPath) {
      if (jsxAttrPath.node.name.name !== "key") {
        return;
      }

      keypath = jsxAttrPath;
    },
  });

  return keypath;
}

export function buildHtmlxNode(codeString: string) {
  const openingElem = t.jsxOpeningElement(t.jsxIdentifier("HTMLxBlock"), []);
  const closingElem = t.jsxClosingElement(t.jsxIdentifier("HTMLxBlock"));
  const jsxExpr = t.jsxExpressionContainer(t.stringLiteral(codeString));
  const children = [jsxExpr];

  return t.jsxElement(openingElem, closingElem, children);
}

export const pickCode = <A extends object, Keys extends O.SelectKeys<A, Node>>(
  node: A,
  ...keys: Keys[]
): Record<Keys, string> => {
  const reduce = keys.reduce(
      // @ts-expect-error node ruim
    (prev, key) => ({ ...prev, [key]: getCode(node[key as keyof typeof node]) }),
    {} as Record<keyof A, string>
  );
  return reduce;
};
