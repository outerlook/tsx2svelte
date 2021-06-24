import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  ArrowFunctionExpression,
  FunctionDeclaration,
  isObjectPattern,
} from "@babel/types";
import {
  createReactiveDeclarationForIdentifier,
  createReactiveStatement,
  getComponentBodyPath,
  getExportLetNodeForProp,

} from "../astHelpers";
import assert from "assert";
import {PossibleReactFunctions} from "./react/utils";

export const getPropsPath = (
  funcPath: NodePath<ArrowFunctionExpression | FunctionDeclaration>
) => {
  const params = funcPath.node.params;
  if (params.length === 0) return [];
  let objOrProps = params[0];
  if (isObjectPattern(objOrProps)) {
    return funcPath.get("params.0.properties") as NodePath<
      t.ObjectProperty | t.SpreadElement
    >[];
  }
};

export const getExportLetProps = (
  funcPath: NodePath<ArrowFunctionExpression | FunctionDeclaration>
) => {
  const propsPath = getPropsPath(funcPath);

  const restPaths = propsPath?.filter((a) =>
    a.isRestElement()
  ) as NodePath<t.SpreadElement>[];

  const objPropPaths = propsPath?.filter((a) =>
    a.isObjectProperty()
  ) as NodePath<t.ObjectProperty>[];

  objPropPaths.forEach(({ node }) => {
    assert.ok(node.shorthand, "Only works for shorthand now");
  });

  const declarationsToInsert: t.Statement[] = [];

  objPropPaths.forEach(({ node }) => {
    if (!t.isIdentifier(node.key)) throw new Error("impossivel");
    const exportLetNodeForProp = getExportLetNodeForProp(node.key.name);
    declarationsToInsert.push(exportLetNodeForProp);
  });
  restPaths.forEach((restPath) => {
    const argumentPath: NodePath<t.Expression> = restPath.get("argument");
    if (!argumentPath.isIdentifier()) return;

    const reactiveLabel = createReactiveDeclarationForIdentifier(
      argumentPath.node,
      t.identifier("$$restProps")
    );

    transformIntoReactiveStatements(funcPath, argumentPath);

    if (reactiveLabel) declarationsToInsert.push(reactiveLabel);
  });

  unshiftToBody(funcPath, declarationsToInsert);

  funcPath.get("params").forEach((p) => p.remove());
};

export const unshiftToBody = (
  funcPath: NodePath<PossibleReactFunctions>,
  statements: t.Statement[]
) => {
  const bodyPath = funcPath.get("body");
  if (bodyPath.isBlockStatement()) {
    bodyPath.node.body.unshift(...statements);
  }
};

function getVariableDeclarationsFromBody(bodyPath: NodePath<t.BlockStatement>) {
  return bodyPath
    .get("body")
    .filter((a) =>
      a.isVariableDeclaration()
    ) as NodePath<t.VariableDeclaration>[];
}

function variableUsesIdentifier(
  vdPath: NodePath<t.VariableDeclaration>,
  idPath: NodePath<t.Identifier>
) {
  const declarations = vdPath.get("declarations");
  console.assert(declarations.length <= 1);
  const declaration = declarations[0];
  const initPath = declaration.get("init");

  initPath.scope.getOwnBinding(idPath.node.name);

  console.log(initPath.scope.bindings);
}

function isReferenceStatementAtSameBlock(
  idPath: NodePath<t.Identifier>,
  blockPath: NodePath<t.BlockStatement>
) {
  const maybeSame = idPath.getStatementParent()?.parentPath;
  return maybeSame === blockPath;
}

function transformIntoReactiveStatements(
  componentFuncPath: NodePath<PossibleReactFunctions>,
  argumentPath: NodePath<t.Identifier>
) {
  const bodyPath = getComponentBodyPath(componentFuncPath);

  const referencePaths = argumentPath.scope.getBinding(
    argumentPath.node.name
  )?.referencePaths;

  if (bodyPath.isBlockStatement()) {
    referencePaths?.forEach((refPath) => {
      if (
        refPath.isIdentifier() &&
        isReferenceStatementAtSameBlock(refPath, bodyPath)
      ) {
        const statementParent = refPath.getStatementParent();
        if (!statementParent) return;

        if (statementParent.isExpressionStatement()) {
          statementParent.replaceWith(
            createReactiveStatement(statementParent.node)
          );
        } else if (statementParent.isVariableDeclaration()) {
          const decPaths = statementParent.get("declarations");
          statementParent.replaceWithMultiple(
            decPaths.map((decPath) =>
              createReactiveDeclarationForIdentifier(
                decPath.node.id,
                decPath.node.init
              )
            )
          );
        }
      }
    });
  }
}
