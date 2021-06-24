import { FileOrProgram } from "../../../astHelpers/astTypes";
import { getReactBuiltinFunctionUsages } from "./getReactBuiltinFunctionUsages";
import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";
import { switchPathType } from "../../../astHelpers/switchPathType";
import {safeGet} from "../../../astHelpers/safeGet";
import {getCode, prettyPrint} from "../../../compileHelpers";

export const processUseRef = (ast: FileOrProgram) => {
  const callExpPaths = getReactBuiltinFunctionUsages(ast, "useRef");
  callExpPaths.forEach((path) => {
    const tsTypeParam = safeGet(path)("typeParameters.params.0") as NodePath<t.TSType> | undefined;
    const idPath: NodePath = path.getStatementParent()?.get("declarations.0.id") as NodePath;
    idPath.assertIdentifier();

    const initialValuePath = path.get("arguments")?.[0]


      const varName = idPath.node.name;
      const references = idPath.scope.getBinding(varName)?.referencePaths;
      references?.forEach((refPath: NodePath<t.Node>) => {
        refPath.assertIdentifier();
        transformUsage(refPath);
      });

    const newIdentifier = t.identifier(varName)
    if (tsTypeParam) newIdentifier.typeAnnotation = t.tsTypeAnnotation(tsTypeParam.node);
    const newVariableDeclaration = t.variableDeclaration('let',[t.variableDeclarator(newIdentifier, initialValuePath?.node)]);

    path.getStatementParent()?.replaceWith(newVariableDeclaration)
  });
};

function transformUsage(refPath: NodePath<t.Identifier>) {
  const parentPath = refPath.parentPath;
  console.log(parentPath.node.type)

  switchPathType(parentPath)({
    MemberExpression: path => {
      path.replaceWith(refPath)
    }
  })
}
