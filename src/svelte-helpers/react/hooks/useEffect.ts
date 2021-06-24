import { FileOrProgram } from "../../../astHelpers/astTypes";
import { getReactBuiltinFunctionUsages } from "./getReactBuiltinFunctionUsages";
import * as t from '@babel/types'
import {createReactiveStatement} from "../../../astHelpers";
import { NodePath } from "@babel/traverse";

export const processUseEffect = (ast: FileOrProgram) => {
  const callExpPaths = getReactBuiltinFunctionUsages(ast, "useEffect");
  callExpPaths.forEach(path => {
    const blockStatement = path.get('arguments.0.body') as NodePath<t.BlockStatement>
    const parentStatement = path.getStatementParent()!
    parentStatement.replaceWith(createReactiveStatement(blockStatement.node))
    // substituir por labeled block
  })
};
