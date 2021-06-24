import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { findIn } from "../find";

export const appendToClass = (jsxOpeningPath: NodePath<t.JSXOpeningElement>, classToAppend: string) => {
  const currentAttributes = jsxOpeningPath.get("attributes") as NodePath<t.JSXAttribute>[];
  const classAttrPath = findIn(jsxOpeningPath)("JSXAttribute", { name: { name: "className" } })?.[0];

  const classLiteralPath = classAttrPath && findIn(classAttrPath)("StringLiteral")?.[0];

  if (classLiteralPath) {
    classLiteralPath.node.value += ` ${classToAppend}`;
  } else {
    jsxOpeningPath.node.attributes.unshift(t.jsxAttribute(t.jsxIdentifier("className"), t.stringLiteral(classToAppend)));
  }
};
