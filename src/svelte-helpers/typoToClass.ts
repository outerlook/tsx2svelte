import { FileOrProgram } from "../astHelpers/astTypes";
import { findIn } from "../find";
import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";
import { appendToClass } from "./reactUtils";

export const processTypoToClass = (ast: FileOrProgram) => {
  const jsxMemberExpressionPaths = findIn(ast)("JSXMemberExpression", {
    object: { name: "Typo" },
  }).filter((path) => path.parentPath.isJSXOpeningElement());
  jsxMemberExpressionPaths.forEach((jsxMemberPath) => {
    const typoName = jsxMemberPath.node.property.name;
    const divIdNode = t.jsxIdentifier("div");
    jsxMemberPath.replaceWith(divIdNode);
    const jsxOpeningEl = jsxMemberPath.parentPath as NodePath<t.JSXOpeningElement>;
    appendToClass(jsxOpeningEl, typoName);
    const jsxElPath = jsxOpeningEl.parentPath as NodePath<t.JSXElement>;
    const closingElPath = jsxElPath.get("closingElement");
    if (closingElPath.isJSXClosingElement()) {
      closingElPath.get("name").replaceWith(divIdNode);
    }
  });
};
