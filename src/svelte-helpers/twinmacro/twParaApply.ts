import * as t from "@babel/types";
import { findIn } from "../../find";
import { NodePath } from "@babel/traverse";
import {templateTagUtils} from "../templateTagUtils";
import {FileOrProgram} from "../../astHelpers/astTypes";

export const twUtils = {
  getTagContent: (twPath: NodePath<TwNode>) => twPath.get('quasi.quasis.0').node.value.raw as string,
};

type TwNode = t.TaggedTemplateExpression;
export const processTwParaApply = (ast: FileOrProgram) => {
  const twUsages = findIn(ast)("TaggedTemplateExpression", { tag: { name: "tw" } }).filter(a => a.parentPath.isTemplateLiteral());

  twUsages.forEach((twPath: NodePath<t.TaggedTemplateExpression>) => {
    const content = `@apply ${ twUtils.getTagContent(twPath) }`;
    templateTagUtils.replaceTemplateExpression(twPath as NodePath<t.Expression>, content)
  });
};


