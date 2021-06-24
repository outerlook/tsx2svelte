import * as t from "@babel/types";
import { assertJSX, ConditionalExpression, isConditionalExpression, isJSX, LogicalExpression } from "@babel/types";
import { buildHtmlxNode, pickCode } from "../astHelpers";
import { NodePath } from "@babel/traverse";
import { PossibleReactFunctions } from "./react/utils";
import { findIn } from "../find";
import {findReactComponentsInFile} from "./react/findReactComponentsInFile";
import {processTypeAnnotation} from "./typeAnnotations";
import {FileOrProgram} from "../astHelpers/astTypes";

export const getSvelteIfElseNode = (expr: ConditionalExpression) => {
  const codes = pickCode(expr, "consequent", "test", "alternate");
  const svelteIfElseStatementCode = "{#if " + codes.test + "}\n" + codes.consequent + "\n" + "{:else}\n" + codes.alternate + "\n{/if}\n";

  const htmlxBlock = buildHtmlxNode(svelteIfElseStatementCode);
  return htmlxBlock;
};

export const getSvelteIfNode = (expr: LogicalExpression) => {
  const codes = pickCode(expr, "left", "right");

  assertJSX(expr.right);

  const svelteIfElseStatementCode = "{#if " + codes.left + "}\n" + codes.right + "\n{/if}\n";

  const htmlxBlock = buildHtmlxNode(svelteIfElseStatementCode);
  return htmlxBlock;
};

const isJsxFragOrEl = (node: t.Node) => {
  return t.isJSXElement(node) || t.isJSXFragment(node);
};
const anySideIsFragOrEl = (node: t.ConditionalExpression | t.LogicalExpression) => {
  switch (node.type) {
    case "ConditionalExpression":
      return isJsxFragOrEl(node.consequent) || isJsxFragOrEl(node.alternate);
    case "LogicalExpression":
      return isJsxFragOrEl(node.left) || isJsxFragOrEl(node.right);
  }
};

export function replaceIfElseSvelte(condPath: NodePath<ConditionalExpression>) {
  const newIfElseBlock = getSvelteIfElseNode(condPath.node);
  const jsxExprContainer = condPath.findParent(t.isJSXExpressionContainer);
  jsxExprContainer?.replaceWith(newIfElseBlock);
}


export const processConditionalOnFile = (ast: FileOrProgram) => {
  const reactComps = findReactComponentsInFile(ast);
  reactComps.map(processConditionals);
}

export const processConditionals = (path: NodePath) => {
  const findInCompPath = findIn(path);

  const conditionalExpressions = findInCompPath("ConditionalExpression", anySideIsFragOrEl);
  conditionalExpressions.forEach(replaceIfElseSvelte);

  const logicalExpressions = findInCompPath("LogicalExpression", (node) => node.operator === "&&" && anySideIsFragOrEl(node));
  logicalExpressions.forEach(replaceIfSvelte)
};

export function replaceIfSvelte(path: NodePath<LogicalExpression>) {
  if (!(isJSX(path.node.right) || isConditionalExpression(path.node.right))) return;

  const newIfBlock = getSvelteIfNode(path.node);
  const jsxExprContainer = path.findParent(t.isJSXExpressionContainer);
  jsxExprContainer?.replaceWith(newIfBlock);
}
