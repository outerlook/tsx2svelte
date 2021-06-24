import { getCodeFromFile } from "./testUtils";
import { findReactComponentsInFile } from "../src/svelte-helpers/react/findReactComponentsInFile";
import { getAst, getCode } from "../src/compileHelpers";
import { processTypeAnnotation } from "../src/svelte-helpers/typeAnnotations";
import { PossibleReactFunctions } from "../src/svelte-helpers/react/utils";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

describe("type annoations", function () {
  const code = getCodeFromFile("props/typeAnnotation.tsx");
  let ast: t.File;
  let reactComps: NodePath<PossibleReactFunctions>[];
  beforeEach(() => {
    ast = getAst(code);
    reactComps = findReactComponentsInFile(ast);
  });

  test("gets typeannotations ", () => {
    reactComps.map(processTypeAnnotation);
    console.log(getCode(ast));
  });
});
