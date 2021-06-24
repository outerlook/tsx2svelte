import { FileOrProgram } from "../../../astHelpers/astTypes";
import { getReactBuiltinFunctionUsages } from "./getReactBuiltinFunctionUsages";
import * as t from '@babel/types'
import {createReactiveStatement} from "../../../astHelpers";
import { NodePath } from "@babel/traverse";

export const processUseCallback = (ast: FileOrProgram) => {
  const callExpPaths = getReactBuiltinFunctionUsages(ast, "useCallback");
  callExpPaths.forEach(path => {
    const arrowExpression = path.get('arguments.0') as NodePath<t.ArrowFunctionExpression>
    path.replaceWith(arrowExpression)
  })
};
