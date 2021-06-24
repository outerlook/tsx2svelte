import * as t from "@babel/types";
import { JSXIdentifier } from "@babel/types";
import { NodePath } from "@babel/traverse";
import j, { File } from "jscodeshift";
import { findIn } from "../find";

import {getCode} from "../compileHelpers";
import {FileOrProgram} from "../astHelpers/astTypes";

export type ProcessedStyComp = {
  conteudo: string;
  class: string;
};

const styCompUtil = {
  getUsedTag: (styCompPath: NodePath<StyledComponentNode>) =>
    findIn(styCompPath)("MemberExpression", {
      object: { name: "styled" },
    })?.[0]?.node.property.name as string,
  getCompName: (styCompPath: NodePath<StyledComponentNode>) => styCompPath.get("id").node.name as string,
  getReferences: (styCompPath: NodePath<StyledComponentNode>) =>
    styCompPath.scope.getBinding(styCompUtil.getCompName(styCompPath))?.referencePaths ?? [],
};

export const processStyled2Class = (ast: FileOrProgram) => {
  const styledCompPaths = getStyledComponentPaths(ast);

  // aqui vai juntar pra enviar na resposta
  const procStyledComponents: ProcessedStyComp[] = [];

  // em cada styled component devemos
  // substituir nos react components e colocar como classe o nome em snakeCase
  styledCompPaths.forEach((styPath) => {
    const conteudoNode = findIn(styPath)("TemplateLiteral")[0]?.node;
    const conteudoCode = getTemplateLiteralContent(conteudoNode);

    // snakeCase
    const name = styCompUtil.getCompName(styPath);
    const className = toSnakeCase(name);

    // styled.>>div
    alterarStyledComponentUses(styPath);

    styPath.getStatementParent()?.remove();
    procStyledComponents.push({ class: className, conteudo: conteudoCode });
  });

  return procStyledComponents;
};

const getTemplateLiteralContent = ({quasis, expressions}: t.TemplateLiteral) => {
  const expressionToCode = (index: number) => expressions[index] ? getCode(expressions[index]) : ''
  return quasis.reduce((prev, current, index) => prev + current.value.cooked + expressionToCode(index),'')
}

const toSnakeCase = (str: string) => str[0].toLowerCase() + str.slice(1);

function getStyledComponentPaths(ast: FileOrProgram): NodePath<StyledComponentNode>[] {
  return findIn(ast)("VariableDeclarator", {
    init: {
      type: "TaggedTemplateExpression",
      tag: {
        type: "MemberExpression",
        object: { name: "styled" },
      },
    },
  });
}

type StyledComponentNode = t.VariableDeclarator;

function alterarStyledComponentUses(styCompPath: NodePath<StyledComponentNode>) {
  const compName = styCompUtil.getCompName(styCompPath);
  const usedTag = styCompUtil.getUsedTag(styCompPath)
  const toBeAppendedClassName = toSnakeCase(compName);

  const refPaths = styCompUtil.getReferences(styCompPath) as NodePath<JSXIdentifier>[];

  refPaths.forEach((jsxIdPath) => {
    jsxIdPath.node.name = usedTag;

    // pega opening ou close
    const parentPath = jsxIdPath.parentPath;
    // se for opening, pego attributes e tento adicionar a class
    if (parentPath.isJSXOpeningElement()) {
      const attributes = parentPath.node.attributes;

      let newClassName = toBeAppendedClassName;
      parentPath.traverse({
        JSXIdentifier: (jsxIdPath) => {
          if (jsxIdPath.node.name === "className") {
            newClassName += " " + jsxIdPath.parent.value?.expression?.value;
            jsxIdPath.parentPath.remove();
            jsxIdPath.stop();
          }
        },
      });

      const newClassAttr = t.jsxAttribute(t.jsxIdentifier("className"), t.stringLiteral(newClassName));
      attributes.push(newClassAttr);

      // TODO talvez juntar o classname e class?
    }
  });
}
