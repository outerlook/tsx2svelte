import * as parser from "@babel/parser";
import traverse, { Node, NodePath } from "@babel/traverse";
import t, { FunctionDeclaration, VariableDeclaration } from "@babel/types";
import generate from "@babel/generator";
import printAST from "ast-pretty-print";

export function getAst(code: string) {
  return parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
}

export const compileTsx = (code: string) => {
  getAst(code);
};

export const getDeclarations = (ast: Node) => {
  const results: NodePath[] = [];
  traverse(ast, {
    Declaration: (path) => {
      results.push(path);
    },
  });
  return results;
};

type MaybeReactDeclaration = VariableDeclaration | FunctionDeclaration;

export const getCode = (node: Node) => {
  return generate(node, {}).code;
};
export const prettyPrint = (ast: t.Node) => {
  return printAST(ast);
};
