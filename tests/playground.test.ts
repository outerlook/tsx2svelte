import fs from "fs";
import * as path from "path";
import {getAst, getCode} from "../src/compileHelpers";
import { replaceIfElseSvelte, replaceIfSvelte } from "../src/svelte-helpers/conditionalHelpers";
import traverse from "@babel/traverse";
import { processProps } from "../src/codeProcessors";
import { processStyled2Class } from "../src/svelte-helpers/Styled2Class";
import { processTwParaApply } from "../src/svelte-helpers/twinmacro/twParaApply";
import { processTwToClass } from "../src/svelte-helpers/twinmacro/twToClass";
import { reactComponentsToNewFile } from "../src/svelte-helpers/reactToNewFile";
import { getCodeFromFile } from "./testUtils";
import {createUtilsFile} from "../src/svelte-helpers/createUtilsFile";
import {finalizeSvelteCode} from "../src/svelte-helpers/svelteFinalizer";

const code = fs.readFileSync(path.join(process.cwd(), "__testfixtures__/MaisDuvidas.tsx"), "utf8");

test("corrige if else", () => {
  const code = getCodeFromFile("ifElse.tsx");
  const ast = getAst(code);

  traverse(ast, {
    ConditionalExpression: (condPath) => {
      replaceIfElseSvelte(condPath);
    },
  });

  // const result = ( getCode(ast) );
  let code1 = getCode(ast);
  const result = finalizeSvelteCode(code1);

  console.log({ result });
});

test("corrige if svelte", () => {
  const code = getCodeFromFile("if.tsx");
  const ast = getAst(code);

  traverse(ast, {
    LogicalExpression: (condPath) => {
      replaceIfSvelte(condPath);
    },
  });

  const result = finalizeSvelteCode(getCode(ast));
  console.log({ result });
});

test("corrige if svelte com outro no meio", () => {
  const code = getCodeFromFile("if2.tsx");
  const ast = getAst(code);

  traverse(ast, {
    LogicalExpression: (condPath) => {
      replaceIfSvelte(condPath);
    },
  });

  const result = finalizeSvelteCode(getCode(ast));
  console.log({ result });
});

test("fix props", () => {
  const code = getCodeFromFile("props.tsx");
  const ast = getAst(code);

  processProps(ast);

  const out = getCode(ast);
  console.log({ out });
});

test("fix props2", () => {
  const code = getCodeFromFile("props.tsx");
  const ast = getAst(code);

  processProps(ast);

  const out = getCode(ast);
  console.log({ out });
});

test("fix Styled2Class", () => {
  const code = getCodeFromFile("Styled2Class.tsx");
  const ast = getAst(code);

  const classesPraAdicionar = processStyled2Class(ast);

  const out = getCode(ast);
  console.log({ out, classesPraAdicionar });
});

test("fix twParaApply", () => {
  const code = getCodeFromFile("twParaApply.tsx");
  const ast = getAst(code);

  processTwParaApply(ast);

  const out = getCode(ast);
  console.log({ out });
});

test("fix twToClass", () => {
  const code = getCodeFromFile("twToClass.tsx");
  const ast = getAst(code);

  processTwToClass(ast);

  const out = getCode(ast);
  console.log({ out });
});

test("fix reactToNewFile", () => {
  const code = getCodeFromFile("reactToNewFile.tsx");
  const ast = getAst(code);

  const files = reactComponentsToNewFile(ast);

  const out = files.map(f => getCode(f.ast));
  console.log({ out });
});

test ("produce utils", () => {
  const code = getCodeFromFile("e2e/ModalManipulacaoImagemPerfil.tsx");
  const ast = getAst(code);

  createUtilsFile(ast, "modalManipulacaoImagemPerfil");

  const out = getCode(ast);
  console.log({ out });
})

test("Optimize Imports", () => {
  const code = getCodeFromFile("OptimizeImports.tsx")
  const ast = getAst(code);

  createUtilsFile(ast);

  const out = getCode(ast);
  console.log({ out });
})
