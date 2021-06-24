import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { U } from "ts-toolbelt";
import { matchNode } from "./jscodeshift/matchNode";
import {FileOrProgram} from "./astHelpers/astTypes";

export type AllNodesKeys = t.Node["type"] | keyof t.Aliases;
export type ExtractNode<T extends AllNodesKeys> = T extends keyof t.Aliases ? t.Aliases[T] : U.Select<t.Node, { type: T }>;

type NodeFilterHandle<T extends AllNodesKeys> = (node: ExtractNode<T>) => boolean;

type FilterableNode<T extends AllNodesKeys> = {
  [key in keyof ExtractNode<T>]?: ExtractNode<T>[key] extends infer KeyNode
        ? (KeyNode extends string ? KeyNode : FilterableAny<KeyNode>)
        : never
} | NodeFilterHandle<T>;

type FilterableAny<T extends any> = { [key in keyof T]?: T[key] extends object ? FilterableAny<T[key]> : T[key] };

type test = ExtractNode<"VariableDeclarator">;
type test2 = ExtractNode<"Expression">;

type test3 = FilterableNode<"VariableDeclarator">;

export const findIn =
  (pathOrFile: NodePath<any> | FileOrProgram) =>
  <T extends AllNodesKeys>(type: T, filter?: FilterableNode<T>) => {
    const paths: NodePath<ExtractNode<T>>[] = [];
    const args = {
      // @ts-expect-error não sei como evitar erro no path
      [type]: (path) => {
        if (!filter || matchNode(path.node, filter)) {
          paths.push(path);
        }
      },
    };

    if (t.isFile(pathOrFile) || t.isProgram(pathOrFile)) {
      traverse(pathOrFile, args);
    } else {
      pathOrFile.traverse(args);
    }
    return paths;
  };

export const findClosest =
  (pathOrFile: NodePath<any> | FileOrProgram) =>
  <T extends AllNodesKeys>(type: T, filter?: FilterableNode<T>) => {
    let result: NodePath<ExtractNode<T>> | undefined;
    const args = {
      // @ts-expect-error não sei como evitar erro no path
      [type]: (path) => {
        if (!filter || matchNode(path.node, filter)) {
          result = path;
          path.stop();
        }
      },
    };

    //   traverse(pathOrFile, args);
    if (t.isProgram(pathOrFile) || t.isFile(pathOrFile)) {
      traverse(pathOrFile, args);
    } else {
      pathOrFile.traverse(args);
    }
    return result;
  };
