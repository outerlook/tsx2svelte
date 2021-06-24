import {NodePath} from "@babel/traverse";

export const safeGet = <T>(path: NodePath<T>) => <Path extends string>(pathString: Path) => {
    try {
        const returnedPath = path.get(pathString);
        return returnedPath
    } catch (e) {
        return undefined
    }
}