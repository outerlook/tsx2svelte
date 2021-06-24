import * as t from "@babel/types";
import { Binding, NodePath } from "@babel/traverse";
import { getReactComponentName, PossibleReactFunctions } from "./react/utils";
import { findReactComponentsInFile } from "./react/findReactComponentsInFile";
import * as _ from "lodash";
import {FileOrProgram} from "../astHelpers/astTypes";
import {getAst, getCode} from "../compileHelpers";
import {createProgram} from "../astHelpers/createProgram";

export const reactComponentsToNewFile = (ast: FileOrProgram) => {
  const reactComponents = findReactComponentsInFile(ast);
  const files = reactComponents.map(reactToNewFile);
  return files;
};

export const getExternalBindings = (reactCompPath: NodePath<PossibleReactFunctions>) => {
  const allBindings = _.map(reactCompPath.scope.getAllBindings(), (p) => p) as Binding[];
  const compName = getReactComponentName(reactCompPath);
  const externalBinding = allBindings
    .filter((binding) => binding.identifier.name !== compName && !reactCompPath.scope.hasOwnBinding(binding.identifier.name))
    .filter((binding) => binding.referencePaths.some((refPath) => refPath.isDescendant(reactCompPath)));

  return externalBinding;
};

export const reactToNewFile = (reactCompPath: NodePath<PossibleReactFunctions>) => {
  const compName = getReactComponentName(reactCompPath);
  const externalBindings = getExternalBindings(reactCompPath);
  const allStatements = Array.from(new Set(externalBindings.map((b) => b.path.getStatementParent()?.node)));
  const newBody = _.compact( [...allStatements, reactCompPath.getStatementParent()?.node] );
  const ast = createProgram(newBody );
  return { ast: ast, name: compName };
};
