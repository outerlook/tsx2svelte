import {U} from 'ts-toolbelt';

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
        ? PathImpl2<T>
        : keyof T;

export type MergedPathValue<T, P extends Path<T>> =
    U.Merge<T> extends infer MergedT
        ? P extends `${infer Key}.${infer Rest}`
            ? Key extends keyof MergedT
                ? Rest extends Path<MergedT[Key]>
                    ? MergedPathValue<MergedT[Key], Rest>
                    : never
                : never
            : P extends keyof MergedT
                ? MergedT[P]
                : never
        : never;

// declare type Merge<U extends object> = U.IntersectOf<O.Overwrite<U, {
//     [K in keyof U]: A.At<U, K>;
// }>>;

// type SafeDif<T> = U.ListOf<T> extends infer EmLista
//     ? EmLista extends [infer A, ...infer Rest]
//         ? Rest extends []
//             ? A
//             : Partial<O.Diff<A, SafeDif<L.UnionOf<Rest>>>>
//         : never
//     : never

// export type SafeMerge<U extends object> = O.Overwrite<Merge<U>, SafeDif<U>>


// type A = { a: string, c?: number, same: string }
// type B = { b: number, c: string, same: string }
//
// type AAndB = A & B
// const aIntB: AAndB
// const c = aIntB.c
//
// type AOrB = A | B
// const aAndB: AOrB
// const c = aAndB.c
// const b = aAndB.b // eu quero que seja number | undefined
//
// type MergedAOrB = SafeMerge<AOrB>
// const mergedAOrB: MergedAOrB
// const a = mergedAOrB.a // string | undefined
// const c = mergedAOrB.c // string | number | undefined OK
// const b = mergedAOrB.b // number | undefined
// const same = mergedAOrB.same // string
