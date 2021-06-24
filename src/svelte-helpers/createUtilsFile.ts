import * as t from "@babel/types";
import { isStatementOfReactComponent } from "./react/utils";
import { findClosest } from "../find";
import { isNodeType, isNotNodeType } from "../astHelpers/filterNodeType";
import { NodePath } from "@babel/traverse";
import { FileOrProgram } from "../astHelpers/astTypes";
import {createProgram} from "../astHelpers/createProgram";

export const createUtilsFile = (ast: FileOrProgram, newFileName: string) => {
  const nonReactStatements = findClosest(ast)("Program")
    ?.get("body")
    .filter((a) => !isStatementOfReactComponent(a));

  if (!nonReactStatements) return;

  const newProgram = createProgram(nonReactStatements.map((n) => n.node));
  nonReactStatements.filter(isNotNodeType("ImportDeclaration")).forEach((stmntPath) => {
    if (stmntPath.isDeclaration()) transformIntoImportedDeclarationFromUtilsFile(stmntPath, newFileName);
  });

  return newProgram;
};

export const transformIntoImportedDeclarationFromUtilsFile = (decPath: NodePath<t.Declaration>, source: string) => {
  const name = findClosest(decPath)("Identifier")?.node.name;
  if (!name) return;
  appendToNamedImport(decPath, name, source);
  decPath.remove();
};

export const appendToNamedImport = (path: NodePath, idName: string, source: string) => {
  const programPath = path.scope.getProgramParent().path as NodePath<t.Program>;
  const importDeclarations = programPath.get("body").filter(isNodeType("ImportDeclaration"));
  const importFromSameFile = importDeclarations.find((impPath) => impPath.node.source.value === source);

  const idNode = t.identifier(idName);
  const importSpecifier = t.importSpecifier(idNode, idNode);

  if (importFromSameFile) {
    importFromSameFile.node.specifiers.push(importSpecifier);
  } else {
    programPath.node.body.unshift(t.importDeclaration([importSpecifier], t.stringLiteral(source)));
  }
};
