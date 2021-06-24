import * as t from "@babel/types";
import {getAst, getCode} from "../compileHelpers";

export const createProgram = (...args: Parameters<typeof t.program>) => {
    const program = t.program(...args)
    return getAst(getCode(program))
}