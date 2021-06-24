import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { PossibleReactFunctions } from "./react/utils";
import { switchPathType } from "../astHelpers/switchPathType";
import { getTypeBinding } from "../libs/babel-type-scopes";
import { findClosest } from "../find";
import { insertOnBody } from "./react/insertOnBody";
import { findReactComponentsInFile } from "./react/findReactComponentsInFile";
import { FileOrProgram } from "../astHelpers/astTypes";

type TSDeclaration = t.TSInterfaceDeclaration | t.TSTypeAliasDeclaration;

export const processTypeAnnotation = (reactCompPath: NodePath<PossibleReactFunctions>) => {
  const typeAnnotationDeclaration = getTypeAnnotation(reactCompPath);
  if (typeAnnotationDeclaration) {
    console.log("TINHA TYPE DECLARATION");
    insertOnBody(reactCompPath)(typeAnnotationDeclaration.node);
  }
};

export const processReactComponentTypeAnnotations = (ast: FileOrProgram) => {
  const reactComps = findReactComponentsInFile(ast);
  reactComps.map(processTypeAnnotation);
};

function getTypeAnnotation(reactCompPath: NodePath<PossibleReactFunctions>): NodePath<TSDeclaration> | undefined {
  let typeAnnotationDecPath: NodePath<TSDeclaration> | undefined;
  const identifierPath = getTypeAnnotIdFromReactComp(reactCompPath);
  if (!identifierPath || !identifierPath.isIdentifier()) return;

  switchPathType(identifierPath)({
    Identifier: (path) => {
      const binding = getTypeBinding(path, path.node.name);
      // const binding = path.scope.getBinding(path.node.name)
      typeAnnotationDecPath = binding?.path.getStatementParent() as NodePath<TSDeclaration>;
    },
  });
  return typeAnnotationDecPath;
}

function getTypeAnnotIdFromReactComp(reactCompPath: NodePath<PossibleReactFunctions>): NodePath<t.Identifier> | undefined {
  let typeAnnotId: NodePath<t.Identifier> | undefined;
  switchPathType(reactCompPath)({
    ArrowFunctionExpression: (path) => {
      // const Component2 = (props: Props) => {
      const funcIdentifierPath = path.parentPath.get("id") as NodePath<t.Itentifier>;
      const paramsPath = path.get("params.0") as NodePath<t.ObjectPattern | t.Identifier>;
      typeAnnotId =
        findClosest(paramsPath)("TSTypeReference", { typeName: { type: "Identifier" } })?.get("typeName") ??
        (findClosest(funcIdentifierPath)("TSTypeParameterInstantiation", { params: { 0: { typeName: { type: "Identifier" } } } })?.get(
          "params.0.typeName"
        ) as NodePath<t.Identifier> | undefined);
    },
    FunctionDeclaration: (path) => {
      typeAnnotId = path.get("params.0.typeAnnotation.typeAnnotation.typeName") as NodePath<t.Identifier> | undefined;
    },
  });
  console.log("TYPE ANNOTATION FOUND => ", typeAnnotId?.node.name);
  return typeAnnotId;
}
