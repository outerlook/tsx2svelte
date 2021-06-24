import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";
import { getReturnedByFunction } from "../../astHelpers/getReturnedByFunction";
import { switchPathType } from "../../astHelpers/switchPathType";
import { findClosest, findIn } from "../../find";

export type PossibleReactFunctions = t.FunctionDeclaration | t.ArrowFunctionExpression;

export const getReactComponentName = (compPath: NodePath<PossibleReactFunctions>) => {
  switch (compPath.node.type) {
    case "ArrowFunctionExpression":
      return compPath.parentPath.node.id.name as string;
    case "FunctionDeclaration":
      return compPath.node.id?.name;
    default:
      throw new Error("Not react function");
  }
};

export const isFunctionOfReactComponent = (funcPath: NodePath<t.Function>) => {
  let isTrue = false;


  switchPathType(funcPath)({
    ArrowFunctionExpression: (path) => {
      isTrue = returnsJSX(path);
    },
    FunctionDeclaration: (path) => {
      isTrue = returnsJSX(path);
    },
  });

  return isTrue;
};

export const isStatementOfReactComponent = (stmntPath: NodePath<t.Statement>) => {
  const functionPath = stmntPath.isFunction() ? stmntPath : findClosest(stmntPath)("Function");
  if (!functionPath) return false;

  return isFunctionOfReactComponent(functionPath);
};

export const returnsJSX = (maybeComp: NodePath<PossibleReactFunctions>) => {
  const returnedPaths = getReturnedByFunction(maybeComp);
  return returnedPaths.some((retPath) => {
    let isTrue = false;
    switchPathType(retPath)({
      JSXElement: (path) => {
        isTrue = true;
      },
      LogicalExpression: (path) => {
        // checa se é condicao && <div/>
        isTrue = path.get("right").isJSXElement() || path.get("left").isJSXElement();
      },
    });
    return isTrue;
  });
};
