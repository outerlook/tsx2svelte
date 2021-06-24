import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export const templateTagUtils = {
  replaceTemplateExpression: (expPath: NodePath<t.Expression>, newString: string) => {
    const expressionIndex = +expPath.key;
    expPath.remove();
    const parentTempLiteral = expPath.parentPath as NodePath<t.TemplateLiteral>;
    const templateElements = parentTempLiteral.node.quasis;
    const oldTempEls = templateElements.splice(expressionIndex, 2);
    const [prevEl, nextEl] = oldTempEls.map((n) => n.value.raw);
    const newValue = [prevEl, newString, nextEl].join("");
    const newTempElement = t.templateElement({ raw: newValue, cooked: newValue });
    templateElements.splice(expressionIndex, 0, newTempElement);
  },
};
