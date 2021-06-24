import {NodePath} from "@babel/traverse";
import {PossibleReactFunctions} from "./utils";
import * as t from '@babel/types'
import {getComponentBodyPath} from "../../astHelpers";
import {switchPathType} from "../../astHelpers/switchPathType";

function expressionToBodyAndReturn(path: NodePath<t.Expression>) {
    return path.replaceWith(t.blockStatement([t.returnStatement(path.node)]))[0]
}

export const insertOnBody = (reactCompPath: NodePath<PossibleReactFunctions>) => (statement: t.Statement) => {
    const bodyPath = getComponentBodyPath(reactCompPath)

    switchPathType(bodyPath)({
        BlockStatement: path => {
            path.node.body.unshift(statement)
        },
        Expression: path => {
            const newPath = expressionToBodyAndReturn(path);
            newPath.node.body.unshift(statement)
        }
    })
}