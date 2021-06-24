import { getExportLetProps } from "./svelte-helpers/manipulateProps";
import fs from "fs";
import path from "path";
import { getAst, getCode } from "./compileHelpers";
import { reactComponentsToNewFile } from "./svelte-helpers/reactToNewFile";
import { processReactComponentTypeAnnotations } from "./svelte-helpers/typeAnnotations";
import { processTwParaApply } from "./svelte-helpers/twinmacro/twParaApply";
import { processStyled2Class } from "./svelte-helpers/Styled2Class";
import { processTwToClass } from "./svelte-helpers/twinmacro/twToClass";
import { createUtilsFile } from "./svelte-helpers/createUtilsFile";
import { camelCase } from "lodash";
import { findReactComponentsInFile } from "./svelte-helpers/react/findReactComponentsInFile";
import { switchPathType } from "./astHelpers/switchPathType";
import { processConditionalOnFile } from "./svelte-helpers/conditionalHelpers";
import { FileOrProgram } from "./astHelpers/astTypes";
import { tsxToSvelteSyntax } from "./svelte-helpers/tsxToSvelteSyntax";
import {processTypoToClass} from "./svelte-helpers/typoToClass";
import {processUseEffect} from "./svelte-helpers/react/hooks/useEffect";
import {processUseCallback} from "./svelte-helpers/react/hooks/useCallback";
import {processUseState} from "./svelte-helpers/react/hooks/useState";
import {processUseRef} from "./svelte-helpers/react/hooks/useRef";

export const processProps = (ast: FileOrProgram) => {
  const reactCompPaths = findReactComponentsInFile(ast);
  reactCompPaths.forEach((path) => {
    switchPathType(path)({
      FunctionDeclaration(path) {
        getExportLetProps(path);
      },
      ArrowFunctionExpression(path) {
        getExportLetProps(path);
      },
    });
  });
};

const readFile = (filePath: string) => fs.readFileSync(filePath, "utf8");

export function processAst(ast: FileOrProgram, actualFileName: string) {
  processTwParaApply(ast);

  const styledContents = processStyled2Class(ast);
  processTwToClass(ast);
  processTypoToClass(ast)
  processUseEffect(ast)
  processUseCallback(ast)
  processUseState(ast)
  processUseRef(ast)

  processReactComponentTypeAnnotations(ast);
  const utilFilename = camelCase(actualFileName);
  const utilAST = createUtilsFile(ast, utilFilename);

  const reactFiles = reactComponentsToNewFile(ast);
  reactFiles.map(({ ast }) => {
    processConditionalOnFile(ast);
  });

  const reactCodes = reactFiles.map(({ name, ast }) => {
    return { name: name + ".svelte", code: tsxToSvelteSyntax({ ast, classes: styledContents }) };
  });

  const allFiles = reactCodes;
  if (utilAST) allFiles.push({ name: utilFilename + ".ts", code: getCode(utilAST) });
  return allFiles;
}

export const processTSXFile = (filePath: string) => {
  const ast = getAst(readFile(filePath));
  const actualFileName = path.basename(filePath, "tsx");
  const actualDir = path.dirname(filePath);

  const files = processAst(ast, actualFileName);

  files.forEach(({ name, code }) => {
    try {
      fs.writeFileSync(path.join(actualDir, name), code, { encoding: "utf8", flag: "wx" });
    } catch (e) {
      console.error(e);
    }
  });
};
