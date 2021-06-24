import { FileOrProgram } from "../../../astHelpers/astTypes";
import { findIn } from "../../../find";
import { matchNode } from "../../../jscodeshift/matchNode";

export function getReactBuiltinFunctionUsages(ast: FileOrProgram, funcName: string) {
  return findIn(ast)("CallExpression", (node) => {
    const calleeNode = node.callee;
    switch (calleeNode.type) {
      case "MemberExpression":
        return matchNode(calleeNode, { property: { name: funcName } });
      case "Identifier":
        return calleeNode.name === funcName;
      default:
        return false;
    }
  });
}