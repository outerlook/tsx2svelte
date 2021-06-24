import { FileOrProgram } from "../astHelpers/astTypes";
import { findClosest } from "../find";
import { isNodeType } from "../astHelpers/filterNodeType";
import { findReactComponentsInFile } from "./react/findReactComponentsInFile";
import assert from "assert";
import { getReturnedByFunction } from "../astHelpers/getReturnedByFunction";
import * as t from "@babel/types";
import { processConditionals } from "./conditionalHelpers";
import { getCode, prettyPrint } from "../compileHelpers";
import { finalizeSvelteCode } from "./svelteFinalizer";
import { NodePath } from "@babel/traverse";
import { PossibleReactFunctions } from "./react/utils";
import { ProcessedStyComp } from "./Styled2Class";

export const tsxToSvelteSyntax = ({ ast, classes }: { ast: FileOrProgram; classes: ProcessedStyComp[] }) => {
  // const root = findClosest(ast)("Program")!;
  // console.log(root.scope)
  const reactCompPaths = findReactComponentsInFile(ast);
  assert(reactCompPaths.length === 1, "There should be only one component at file");

  const reactCompPath = reactCompPaths[0];
  const returnedArgs = getReturnedByFunction(reactCompPath).filter(isNodeType("Expression"));
  returnedArgs.forEach(processConditionals);
  const fragmentProgram = t.program(returnedArgs.map((a) => t.expressionStatement(a.node)));
  const fragmentCode = finalizeSvelteCode(getCode(fragmentProgram));

  returnedArgs.forEach((path) => path.remove());

  moveStatementsOutsideFunction(reactCompPath);

  const scriptCode = wrappedByTag("script", [{ key: "lang", value: "ts" }])(getCode(ast));
  const classCode =
    classes.length > 0
      ? wrappedByTag("style", [
          {
            key: "lang",
            value: "postcss",
          },
        ])(buildClassContent(classes))
      : "";

  return scriptCode + fragmentCode + classCode;
};

const wrappedByTag = (tag: string, attributes?: { key: string; value: string }[]) => (content: string) => {
  const attrStr = attributes?.reduce((prev, { key, value }) => prev + ` ${key}='${value}'`, "");
  return `<${tag}${attrStr}>\n` + `${content}\n` + `</${tag}>\n`;
};

const buildClassContent = (classes: ProcessedStyComp[]) => {
  return classes.reduce((prev, { class: className, conteudo }) => prev + `.${className} {\n${conteudo}\n}\n`, "");
};

function moveStatementsOutsideFunction(reactCompPath: NodePath<PossibleReactFunctions>) {
  const statements = findClosest(reactCompPath)("BlockStatement")?.node.body;
  if (!statements) return;

  const nonReturnStatements = statements.filter((a) => a.type !== "ReturnStatement");
  if (nonReturnStatements.length === 0) return;
  const program = reactCompPath.scope.getProgramParent().path as NodePath<t.Program>;
  program.node.body.push(...nonReturnStatements);
  const declarationStatement = reactCompPath.getStatementParent().remove();
}
