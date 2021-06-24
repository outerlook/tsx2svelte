import {Node, TraversalContext} from "@babel/traverse";
import * as _ from 'lodash'
import {ConditionalExpression, VariableDeclarator} from "@babel/types";


type PathImpl<T, Key extends keyof T> =
    Key extends string
        // tem mais coisa?
        ? T[Key] extends Record<string, any>

            ? | `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}`
            | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
            : never
        : never;

type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;


export type Path<T> =
    PathImpl2<T> extends string | keyof T
    //   a | a.b
    ? PathImpl2<T>
        // a
        : keyof T;

export type PathValue<T, P extends Path<T>> =
    P extends `${infer Key}.${infer Rest}`
    // a.b | a.b.c
        ? Key extends keyof T
            ? Rest extends Path<T[Key]>
                ? PathValue<T[Key], Rest>
                : never
            : never
        // a
        : P extends keyof T
            ? T[P]
            : never;

type test = Node
const a: PathValue<VariableDeclarator, 'id.type'>

// type Get<K> = T[K] extends Array<Node | null | undefined>
//     ? Array<NodePath<T[K][number]>>
//     : T[K] extends Node | null | undefined
//         ? NodePath<T[K]>
//         : never;

// get<K extends keyof T>(
//     key: K,
//     context?: boolean | TraversalContext,
// ): T[K] extends Array<Node | null | undefined>
//     ? Array<NodePath<T[K][number]>>
//     : T[K] extends Node | null | undefined
//         ? NodePath<T[K]>
//         : never;


// declare function get<T, P extends Path<T>>(obj: T, path: P): PathValue<T, P>;