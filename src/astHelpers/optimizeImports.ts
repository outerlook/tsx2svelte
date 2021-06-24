import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";
import { prettyPrint } from "recast";

export const optimizeImports = (path: NodePath<t.Node>) => {
  const programPath = path.scope.getProgramParent().path;
  console.log(prettyPrint(programPath.node));
};