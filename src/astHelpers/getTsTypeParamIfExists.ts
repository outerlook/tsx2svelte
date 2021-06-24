import { NodePath } from "@babel/traverse";
import { ExtractNode } from "../find";
import { safeGet } from "./safeGet";
import * as t from "@babel/types";

export function getTsTypeParamIfExists(path: NodePath<ExtractNode<"CallExpression">>) {
  const tsTypeParam = safeGet(path)("typeParameters.params.0") as NodePath<t.TSType> | undefined;
  return tsTypeParam;
}