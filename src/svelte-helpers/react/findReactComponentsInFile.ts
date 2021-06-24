import { NodePath } from "@babel/traverse";
import { findIn } from "../../find";
import { isFunctionOfReactComponent, PossibleReactFunctions } from "./utils";
import { FileOrProgram } from "../../astHelpers/astTypes";

export const findReactComponentsInFile = (ast: FileOrProgram) => {
  const reactComponents = findIn(ast)("Function").filter((path) => isFunctionOfReactComponent(path));

  return reactComponents as NodePath<PossibleReactFunctions>[];
};
