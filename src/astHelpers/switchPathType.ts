import { ExtractNode } from "../find";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { isType } from "@babel/types";

type NodePathHandler<NodeType extends t.Node["type"]> = (path: NodePath<ExtractNode<NodeType>>) => void;

// essa implementacao significa que mais de um expressao pode acontecer junto. Expressions > Function expression
export const switchPathType =
  <General extends t.Node | null | undefined>(path: NodePath<General>) =>
  <Keys extends General extends t.Node ? General['type'] : never>(cases: { [key in Keys]?: NodePathHandler<key> }) => {
    Object.keys(cases).forEach((key) => {
      if (path.node && isType(key, path.node.type)) {
        // @ts-ignore
        cases[key]?.(path);
      }
    });
  };