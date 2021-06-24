import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { switchPathType } from "./switchPathType";
import { isNodeType } from "./filterNodeType";
import * as _ from "lodash";

export function getReturnedByFunction(maybeComp: NodePath<t.Function>) {
  const returnArray: NodePath<t.Expression | null | undefined>[] = [];
  switchPathType(maybeComp)({
    FunctionDeclaration: (path) => {
      const returnStatements = path.get("body").get("body").filter(isNodeType("ReturnStatement"));
      const returnArguments = returnStatements.map((r) => r.get("argument"));
      returnArray.push(..._.compact(returnArguments));
    },
    ArrowFunctionExpression: (path) => {
      const exprsOrBlock = path.get("body");
      switchPathType(exprsOrBlock)({
        JSXElement: (path) => {
          returnArray.push(path);
        },
        BlockStatement: (path) => {
          const returnStatements = path.get("body").filter(isNodeType("ReturnStatement"));
          const returnArguments = returnStatements.map((r) => r.get("argument"));
          returnArray.push(..._.compact(returnArguments));
        },

      });
    },
  });
  return returnArray;
}
