import { FileOrProgram } from "../../../astHelpers/astTypes";
import { getReactBuiltinFunctionUsages } from "./getReactBuiltinFunctionUsages";
import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";
import { getTsTypeParamIfExists } from "../../../astHelpers/getTsTypeParamIfExists";

export const processUseState = (ast: FileOrProgram) => {
  const callExpPaths = getReactBuiltinFunctionUsages(ast, "useState");
  callExpPaths.forEach((path) => {
    const tsTypeParam = getTsTypeParamIfExists(path);
    const idArrayPath: NodePath = path.getStatementParent()?.get("declarations.0.id") as NodePath;
    idArrayPath.assertArrayPattern();

    // state
    const stateIdPath: NodePath = idArrayPath.get("elements.0") as NodePath;
    stateIdPath.assertIdentifier();
    const stateName = stateIdPath.node.name;
    // setState
    const setterIdPath: NodePath = idArrayPath.get("elements.1") as NodePath;
    // initialValue
    const initialValuePath: NodePath = path.get("arguments.0") as NodePath;

    if (setterIdPath.isIdentifier()) {
      const setterName = setterIdPath.node.name;
      const references = setterIdPath.scope.getBinding(setterName)?.referencePaths;
      references?.forEach((refPath: NodePath<t.Node>) => {
        refPath.assertIdentifier();
        transformSetterUsage(refPath, stateName);
      });
    }

    const newIdentifier = t.identifier(stateName);
    if (tsTypeParam) newIdentifier.typeAnnotation = t.tsTypeAnnotation(tsTypeParam.node);
    const newVariableDeclaration = t.variableDeclaration("let", [t.variableDeclarator(newIdentifier, initialValuePath?.node)]);

    path.getStatementParent()?.replaceWith(newVariableDeclaration);
  });
};

function transformSetterUsage(refPath: NodePath<t.Identifier>, stateName: string) {
  const parentPath = refPath.parentPath;
  if (parentPath.isCallExpression()) {
    const setExpression = parentPath.get("arguments.0");
    let newExpression;
    setExpression.assertExpression();
    if (setExpression.isArrowFunctionExpression()) {
      const argId = path.get("params.0");
      argId.assertIdentifier();

      const argName = argId.node.name;
      argId.scope.rename(argName, stateName);
      newExpression = path.get("body").node;
    } else {
      newExpression = setExpression.node
    }
    const newAssignation = t.assignmentExpression('=', t.identifier(stateName), newExpression)
    parentPath.replaceWith(t.expressionStatement(newAssignation))
  }
}
