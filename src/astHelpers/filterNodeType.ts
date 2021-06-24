import * as t from "@babel/types";
import { isType } from "@babel/types";
import { NodePath } from "@babel/traverse";
import {AllNodesKeys, ExtractNode} from "../find";
import { U } from "ts-toolbelt";

export const isNodeType =
  <Type extends AllNodesKeys>(type: Type) =>
  <General extends t.Node | null | undefined>(
    moreGeneralPath: NodePath<General>
  ): moreGeneralPath is General extends ExtractNode<Type> ? NodePath<ExtractNode<Type>> : never => {
    return moreGeneralPath.node && isType(moreGeneralPath.node.type, type);
  };

export const isNotNodeType =
  <Type extends t.Node["type"]>(type: Type) =>
  <General extends t.Node>(
    moreGeneralPath: NodePath<General>
  ): moreGeneralPath is NodePath<General> extends NodePath<ExtractNode<U.Exclude<General, Type>>>
    ? NodePath<ExtractNode<U.Exclude<General, Type>>>
    : never => {
    return !isType(moreGeneralPath.node.type, type);
  };
