import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export const twUtils = {
  getTagContent: (twPath: NodePath<TwNode>) => twPath.get("quasi.quasis.0").node.value.raw as string,
};
type TwNode = t.TaggedTemplateExpression;