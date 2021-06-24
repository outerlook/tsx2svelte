import * as t from "@babel/types";
import { findIn } from "../../find";
import { NodePath } from "@babel/traverse";
import { templateTagUtils } from "../templateTagUtils";
import { twUtils } from "./twUtils";
import {appendToClass} from "../reactUtils";
import {FileOrProgram} from "../../astHelpers/astTypes";

export const processTwToClass = (ast: FileOrProgram) => {
  const twUsages = findIn(ast)("TaggedTemplateExpression", { tag: { name: "tw" } }).filter((a) => a.parentPath.isJSXExpressionContainer());

  twUsages.forEach((twPath: NodePath<t.TaggedTemplateExpression>) => {
    const content = `${twUtils.getTagContent(twPath)}`;
    const attrPath = twPath.parentPath.parentPath as NodePath<t.JSXAttribute>
    if (attrPath.node.name.name !== 'styled') return;
    const jsxOpeningPath = attrPath.parentPath as NodePath<t.JSXOpeningElement>
    appendToClass(jsxOpeningPath, content)

    attrPath.remove()
  });
};
