import j, { Collection } from "jscodeshift";
import { TraversalMethods } from "jscodeshift/src/collections/Node";
import {fromPaths} from "jscodeshift/src/Collection";



// find<T>(type: types.Type<T>, filter?: ((value: any) => boolean) | object): Collection.Collection<T>
// find nodes and separate them on returning
export const findNodesThenFromPaths = <T>([collection, ...findArgs]: [
  collection: Collection<any>,
  ...findArgs: Parameters<TraversalMethods["find"]>
]) => {
  return collection.find(...findArgs);
};

export const fromPathsReal = <T>(collection: Collection<T>) => {
    return fromPaths(collection.paths()) as Collection<T>
}

export const extractReactComponents = (code: string) => {
  const _fromPathsReal = fromPathsReal

  const root = j(code);

  console.log({variableDeclarations})
};