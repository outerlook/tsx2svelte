import * as t from '@babel/types'
declare module "@babel/traverse" {
  export interface NodePath<T = Node> {
    //#region ------------------------- assertXXX -------------------------
    assertAnyTypeAnnotation(props?: object | null): asserts this is NodePath<t.AnyTypeAnnotation>;

    assertArrayExpression(props?: object | null): asserts this is NodePath<t.ArrayExpression>;

    assertArrayPattern(props?: object | null): asserts this is NodePath<t.ArrayPattern>;

    assertArrayTypeAnnotation(props?: object | null): asserts this is NodePath<t.ArrayTypeAnnotation>;

    assertArrowFunctionExpression(props?: object | null): asserts this is NodePath<t.ArrowFunctionExpression>;

    assertAssignmentExpression(props?: object | null): asserts this is NodePath<t.AssignmentExpression>;

    assertAssignmentPattern(props?: object | null): asserts this is NodePath<t.AssignmentPattern>;

    assertAwaitExpression(props?: object | null): asserts this is NodePath<t.AwaitExpression>;

    assertBigIntLiteral(props?: object | null): asserts this is NodePath<t.BigIntLiteral>;

    assertBinary(props?: object | null): asserts this is NodePath<t.Binary>;

    assertBinaryExpression(props?: object | null): asserts this is NodePath<t.BinaryExpression>;

    assertBindExpression(props?: object | null): asserts this is NodePath<t.BindExpression>;

    assertBlock(props?: object | null): asserts this is NodePath<t.Block>;

    assertBlockParent(props?: object | null): asserts this is NodePath<t.BlockParent>;

    assertBlockStatement(props?: object | null): asserts this is NodePath<t.BlockStatement>;

    assertBooleanLiteral(props?: object | null): asserts this is NodePath<t.BooleanLiteral>;

    assertBooleanLiteralTypeAnnotation(props?: object | null): asserts this is NodePath<t.BooleanLiteralTypeAnnotation>;

    assertBooleanTypeAnnotation(props?: object | null): asserts this is NodePath<t.BooleanTypeAnnotation>;

    assertBreakStatement(props?: object | null): asserts this is NodePath<t.BreakStatement>;

    assertCallExpression(props?: object | null): asserts this is NodePath<t.CallExpression>;

    assertCatchClause(props?: object | null): asserts this is NodePath<t.CatchClause>;

    assertClass(props?: object | null): asserts this is NodePath<t.Class>;

    assertClassBody(props?: object | null): asserts this is NodePath<t.ClassBody>;

    assertClassDeclaration(props?: object | null): asserts this is NodePath<t.ClassDeclaration>;

    assertClassExpression(props?: object | null): asserts this is NodePath<t.ClassExpression>;

    assertClassImplements(props?: object | null): asserts this is NodePath<t.ClassImplements>;

    assertClassMethod(props?: object | null): asserts this is NodePath<t.ClassMethod>;

    assertClassPrivateMethod(props?: object | null): asserts this is NodePath<t.ClassPrivateMethod>;

    assertClassPrivateProperty(props?: object | null): asserts this is NodePath<t.ClassPrivateProperty>;

    assertClassProperty(props?: object | null): asserts this is NodePath<t.ClassProperty>;

    assertCompletionStatement(props?: object | null): asserts this is NodePath<t.CompletionStatement>;

    assertConditional(props?: object | null): asserts this is NodePath<t.Conditional>;

    assertConditionalExpression(props?: object | null): asserts this is NodePath<t.ConditionalExpression>;

    assertContinueStatement(props?: object | null): asserts this is NodePath<t.ContinueStatement>;

    assertDebuggerStatement(props?: object | null): asserts this is NodePath<t.DebuggerStatement>;

    assertDeclaration(props?: object | null): asserts this is NodePath<t.Declaration>;

    assertDeclareClass(props?: object | null): asserts this is NodePath<t.DeclareClass>;

    assertDeclareExportAllDeclaration(props?: object | null): asserts this is NodePath<t.DeclareExportAllDeclaration>;

    assertDeclareExportDeclaration(props?: object | null): asserts this is NodePath<t.DeclareExportDeclaration>;

    assertDeclareFunction(props?: object | null): asserts this is NodePath<t.DeclareFunction>;

    assertDeclareInterface(props?: object | null): asserts this is NodePath<t.DeclareInterface>;

    assertDeclareModule(props?: object | null): asserts this is NodePath<t.DeclareModule>;

    assertDeclareModuleExports(props?: object | null): asserts this is NodePath<t.DeclareModuleExports>;

    assertDeclareOpaqueType(props?: object | null): asserts this is NodePath<t.DeclareOpaqueType>;

    assertDeclareTypeAlias(props?: object | null): asserts this is NodePath<t.DeclareTypeAlias>;

    assertDeclareVariable(props?: object | null): asserts this is NodePath<t.DeclareVariable>;

    assertDeclaredPredicate(props?: object | null): asserts this is NodePath<t.DeclaredPredicate>;

    assertDecorator(props?: object | null): asserts this is NodePath<t.Decorator>;

    assertDirective(props?: object | null): asserts this is NodePath<t.Directive>;

    assertDirectiveLiteral(props?: object | null): asserts this is NodePath<t.DirectiveLiteral>;

    assertDoExpression(props?: object | null): asserts this is NodePath<t.DoExpression>;

    assertDoWhileStatement(props?: object | null): asserts this is NodePath<t.DoWhileStatement>;

    assertEmptyStatement(props?: object | null): asserts this is NodePath<t.EmptyStatement>;

    assertEmptyTypeAnnotation(props?: object | null): asserts this is NodePath<t.EmptyTypeAnnotation>;

    assertExistsTypeAnnotation(props?: object | null): asserts this is NodePath<t.ExistsTypeAnnotation>;

    assertExportAllDeclaration(props?: object | null): asserts this is NodePath<t.ExportAllDeclaration>;

    assertExportDeclaration(props?: object | null): asserts this is NodePath<t.ExportDeclaration>;

    assertExportDefaultDeclaration(props?: object | null): asserts this is NodePath<t.ExportDefaultDeclaration>;

    assertExportDefaultSpecifier(props?: object | null): asserts this is NodePath<t.ExportDefaultSpecifier>;

    assertExportNamedDeclaration(props?: object | null): asserts this is NodePath<t.ExportNamedDeclaration>;

    assertExportNamespaceSpecifier(props?: object | null): asserts this is NodePath<t.ExportNamespaceSpecifier>;

    assertExportSpecifier(props?: object | null): asserts this is NodePath<t.ExportSpecifier>;

    assertExpression(props?: object | null): asserts this is NodePath<t.Expression>;

    assertExpressionStatement(props?: object | null): asserts this is NodePath<t.ExpressionStatement>;

    assertExpressionWrapper(props?: object | null): asserts this is NodePath<t.ExpressionWrapper>;

    assertFile(props?: object | null): asserts this is NodePath<t.File>;

    assertFlow(props?: object | null): asserts this is NodePath<t.Flow>;

    assertFlowBaseAnnotation(props?: object | null): asserts this is NodePath<t.FlowBaseAnnotation>;

    assertFlowDeclaration(props?: object | null): asserts this is NodePath<t.FlowDeclaration>;

    assertFlowPredicate(props?: object | null): asserts this is NodePath<t.FlowPredicate>;

    assertFlowType(props?: object | null): asserts this is NodePath<t.FlowType>;

    assertFor(props?: object | null): asserts this is NodePath<t.For>;

    assertForInStatement(props?: object | null): asserts this is NodePath<t.ForInStatement>;

    assertForOfStatement(props?: object | null): asserts this is NodePath<t.ForOfStatement>;

    assertForStatement(props?: object | null): asserts this is NodePath<t.ForStatement>;

    assertForXStatement(props?: object | null): asserts this is NodePath<t.ForXStatement>;

    assertFunction(props?: object | null): asserts this is NodePath<t.Function>;

    assertFunctionDeclaration(props?: object | null): asserts this is NodePath<t.FunctionDeclaration>;

    assertFunctionExpression(props?: object | null): asserts this is NodePath<t.FunctionExpression>;

    assertFunctionParent(props?: object | null): asserts this is NodePath<t.FunctionParent>;

    assertFunctionTypeAnnotation(props?: object | null): asserts this is NodePath<t.FunctionTypeAnnotation>;

    assertFunctionTypeParam(props?: object | null): asserts this is NodePath<t.FunctionTypeParam>;

    assertGenericTypeAnnotation(props?: object | null): asserts this is NodePath<t.GenericTypeAnnotation>;

    assertIdentifier(props?: object | null): asserts this is NodePath<t.Identifier>;

    assertIfStatement(props?: object | null): asserts this is NodePath<t.IfStatement>;

    assertImmutable(props?: object | null): asserts this is NodePath<t.Immutable>;

    assertImport(props?: object | null): asserts this is NodePath<t.Import>;

    assertImportDeclaration(props?: object | null): asserts this is NodePath<t.ImportDeclaration>;

    assertImportDefaultSpecifier(props?: object | null): asserts this is NodePath<t.ImportDefaultSpecifier>;

    assertImportNamespaceSpecifier(props?: object | null): asserts this is NodePath<t.ImportNamespaceSpecifier>;

    assertImportSpecifier(props?: object | null): asserts this is NodePath<t.ImportSpecifier>;

    assertInferredPredicate(props?: object | null): asserts this is NodePath<t.InferredPredicate>;

    assertInterfaceDeclaration(props?: object | null): asserts this is NodePath<t.InterfaceDeclaration>;

    assertInterfaceExtends(props?: object | null): asserts this is NodePath<t.InterfaceExtends>;

    assertInterfaceTypeAnnotation(props?: object | null): asserts this is NodePath<t.InterfaceTypeAnnotation>;

    assertInterpreterDirective(props?: object | null): asserts this is NodePath<t.InterpreterDirective>;

    assertIntersectionTypeAnnotation(props?: object | null): asserts this is NodePath<t.IntersectionTypeAnnotation>;

    assertJSX(props?: object | null): asserts this is NodePath<t.JSX>;

    assertJSXAttribute(props?: object | null): asserts this is NodePath<t.JSXAttribute>;

    assertJSXClosingElement(props?: object | null): asserts this is NodePath<t.JSXClosingElement>;

    assertJSXClosingFragment(props?: object | null): asserts this is NodePath<t.JSXClosingFragment>;

    assertJSXElement(props?: object | null): asserts this is NodePath<t.JSXElement>;

    assertJSXEmptyExpression(props?: object | null): asserts this is NodePath<t.JSXEmptyExpression>;

    assertJSXExpressionContainer(props?: object | null): asserts this is NodePath<t.JSXExpressionContainer>;

    assertJSXFragment(props?: object | null): asserts this is NodePath<t.JSXFragment>;

    assertJSXIdentifier(props?: object | null): asserts this is NodePath<t.JSXIdentifier>;

    assertJSXMemberExpression(props?: object | null): asserts this is NodePath<t.JSXMemberExpression>;

    assertJSXNamespacedName(props?: object | null): asserts this is NodePath<t.JSXNamespacedName>;

    assertJSXOpeningElement(props?: object | null): asserts this is NodePath<t.JSXOpeningElement>;

    assertJSXOpeningFragment(props?: object | null): asserts this is NodePath<t.JSXOpeningFragment>;

    assertJSXSpreadAttribute(props?: object | null): asserts this is NodePath<t.JSXSpreadAttribute>;

    assertJSXSpreadChild(props?: object | null): asserts this is NodePath<t.JSXSpreadChild>;

    assertJSXText(props?: object | null): asserts this is NodePath<t.JSXText>;

    assertLVal(props?: object | null): asserts this is NodePath<t.LVal>;

    assertLabeledStatement(props?: object | null): asserts this is NodePath<t.LabeledStatement>;

    assertLiteral(props?: object | null): asserts this is NodePath<t.Literal>;

    assertLogicalExpression(props?: object | null): asserts this is NodePath<t.LogicalExpression>;

    assertLoop(props?: object | null): asserts this is NodePath<t.Loop>;

    assertMemberExpression(props?: object | null): asserts this is NodePath<t.MemberExpression>;

    assertMetaProperty(props?: object | null): asserts this is NodePath<t.MetaProperty>;

    assertMethod(props?: object | null): asserts this is NodePath<t.Method>;

    assertMixedTypeAnnotation(props?: object | null): asserts this is NodePath<t.MixedTypeAnnotation>;

    assertModuleDeclaration(props?: object | null): asserts this is NodePath<t.ModuleDeclaration>;

    assertModuleSpecifier(props?: object | null): asserts this is NodePath<t.ModuleSpecifier>;

    assertNewExpression(props?: object | null): asserts this is NodePath<t.NewExpression>;

    assertNoop(props?: object | null): asserts this is NodePath<t.Noop>;

    assertNullLiteral(props?: object | null): asserts this is NodePath<t.NullLiteral>;

    assertNullLiteralTypeAnnotation(props?: object | null): asserts this is NodePath<t.NullLiteralTypeAnnotation>;

    assertNullableTypeAnnotation(props?: object | null): asserts this is NodePath<t.NullableTypeAnnotation>;

    /** @deprecated Use `assertNumericLiteral` */
    assertNumberLiteral(props?: object | null): asserts this is NodePath<t.NumberLiteral>;

    assertNumberLiteralTypeAnnotation(props?: object | null): asserts this is NodePath<t.NumberLiteralTypeAnnotation>;

    assertNumberTypeAnnotation(props?: object | null): asserts this is NodePath<t.NumberTypeAnnotation>;

    assertNumericLiteral(props?: object | null): asserts this is NodePath<t.NumericLiteral>;

    assertObjectExpression(props?: object | null): asserts this is NodePath<t.ObjectExpression>;

    assertObjectMember(props?: object | null): asserts this is NodePath<t.ObjectMember>;

    assertObjectMethod(props?: object | null): asserts this is NodePath<t.ObjectMethod>;

    assertObjectPattern(props?: object | null): asserts this is NodePath<t.ObjectPattern>;

    assertObjectProperty(props?: object | null): asserts this is NodePath<t.ObjectProperty>;

    assertObjectTypeAnnotation(props?: object | null): asserts this is NodePath<t.ObjectTypeAnnotation>;

    assertObjectTypeCallProperty(props?: object | null): asserts this is NodePath<t.ObjectTypeCallProperty>;

    assertObjectTypeIndexer(props?: object | null): asserts this is NodePath<t.ObjectTypeIndexer>;

    assertObjectTypeInternalSlot(props?: object | null): asserts this is NodePath<t.ObjectTypeInternalSlot>;

    assertObjectTypeProperty(props?: object | null): asserts this is NodePath<t.ObjectTypeProperty>;

    assertObjectTypeSpreadProperty(props?: object | null): asserts this is NodePath<t.ObjectTypeSpreadProperty>;

    assertOpaqueType(props?: object | null): asserts this is NodePath<t.OpaqueType>;

    assertOptionalCallExpression(props?: object | null): asserts this is NodePath<t.OptionalCallExpression>;

    assertOptionalMemberExpression(props?: object | null): asserts this is NodePath<t.OptionalMemberExpression>;

    assertParenthesizedExpression(props?: object | null): asserts this is NodePath<t.ParenthesizedExpression>;

    assertPattern(props?: object | null): asserts this is NodePath<t.Pattern>;

    assertPatternLike(props?: object | null): asserts this is NodePath<t.PatternLike>;

    assertPipelineBareFunction(props?: object | null): asserts this is NodePath<t.PipelineBareFunction>;

    assertPipelinePrimaryTopicReference(props?: object | null): asserts this is NodePath<t.PipelinePrimaryTopicReference>;

    assertPipelineTopicExpression(props?: object | null): asserts this is NodePath<t.PipelineTopicExpression>;

    assertPrivate(props?: object | null): asserts this is NodePath<t.Private>;

    assertPrivateName(props?: object | null): asserts this is NodePath<t.PrivateName>;

    assertProgram(props?: object | null): asserts this is NodePath<t.Program>;

    assertProperty(props?: object | null): asserts this is NodePath<t.Property>;

    assertPureish(props?: object | null): asserts this is NodePath<t.Pureish>;

    assertQualifiedTypeIdentifier(props?: object | null): asserts this is NodePath<t.QualifiedTypeIdentifier>;

    assertRegExpLiteral(props?: object | null): asserts this is NodePath<t.RegExpLiteral>;

    /** @deprecated Use `assertRegExpLiteral` */
    assertRegexLiteral(props?: object | null): asserts this is NodePath<t.RegexLiteral>;

    assertRestElement(props?: object | null): asserts this is NodePath<t.RestElement>;

    /** @deprecated Use `assertRestElement` */
    assertRestProperty(props?: object | null): asserts this is NodePath<t.RestProperty>;

    assertReturnStatement(props?: object | null): asserts this is NodePath<t.ReturnStatement>;

    assertScopable(props?: object | null): asserts this is NodePath<t.Scopable>;

    assertSequenceExpression(props?: object | null): asserts this is NodePath<t.SequenceExpression>;

    assertSpreadElement(props?: object | null): asserts this is NodePath<t.SpreadElement>;

    /** @deprecated Use `assertSpreadElement` */
    assertSpreadProperty(props?: object | null): asserts this is NodePath<t.SpreadProperty>;

    assertStatement(props?: object | null): asserts this is NodePath<t.Statement>;

    assertStringLiteral(props?: object | null): asserts this is NodePath<t.StringLiteral>;

    assertStringLiteralTypeAnnotation(props?: object | null): asserts this is NodePath<t.StringLiteralTypeAnnotation>;

    assertStringTypeAnnotation(props?: object | null): asserts this is NodePath<t.StringTypeAnnotation>;

    assertSuper(props?: object | null): asserts this is NodePath<t.Super>;

    assertSwitchCase(props?: object | null): asserts this is NodePath<t.SwitchCase>;

    assertSwitchStatement(props?: object | null): asserts this is NodePath<t.SwitchStatement>;

    assertTSAnyKeyword(props?: object | null): asserts this is NodePath<t.TSAnyKeyword>;

    assertTSArrayType(props?: object | null): asserts this is NodePath<t.TSArrayType>;

    assertTSAsExpression(props?: object | null): asserts this is NodePath<t.TSAsExpression>;

    assertTSBooleanKeyword(props?: object | null): asserts this is NodePath<t.TSBooleanKeyword>;

    assertTSCallSignatureDeclaration(props?: object | null): asserts this is NodePath<t.TSCallSignatureDeclaration>;

    assertTSConditionalType(props?: object | null): asserts this is NodePath<t.TSConditionalType>;

    assertTSConstructSignatureDeclaration(props?: object | null): asserts this is NodePath<t.TSConstructSignatureDeclaration>;

    assertTSConstructorType(props?: object | null): asserts this is NodePath<t.TSConstructorType>;

    assertTSDeclareFunction(props?: object | null): asserts this is NodePath<t.TSDeclareFunction>;

    assertTSDeclareMethod(props?: object | null): asserts this is NodePath<t.TSDeclareMethod>;

    assertTSEntityName(props?: object | null): asserts this is NodePath<t.TSEntityName>;

    assertTSEnumDeclaration(props?: object | null): asserts this is NodePath<t.TSEnumDeclaration>;

    assertTSEnumMember(props?: object | null): asserts this is NodePath<t.TSEnumMember>;

    assertTSExportAssignment(props?: object | null): asserts this is NodePath<t.TSExportAssignment>;

    assertTSExpressionWithTypeArguments(props?: object | null): asserts this is NodePath<t.TSExpressionWithTypeArguments>;

    assertTSExternalModuleReference(props?: object | null): asserts this is NodePath<t.TSExternalModuleReference>;

    assertTSFunctionType(props?: object | null): asserts this is NodePath<t.TSFunctionType>;

    assertTSImportEqualsDeclaration(props?: object | null): asserts this is NodePath<t.TSImportEqualsDeclaration>;

    assertTSImportType(props?: object | null): asserts this is NodePath<t.TSImportType>;

    assertTSIndexSignature(props?: object | null): asserts this is NodePath<t.TSIndexSignature>;

    assertTSIndexedAccessType(props?: object | null): asserts this is NodePath<t.TSIndexedAccessType>;

    assertTSInferType(props?: object | null): asserts this is NodePath<t.TSInferType>;

    assertTSInterfaceBody(props?: object | null): asserts this is NodePath<t.TSInterfaceBody>;

    assertTSInterfaceDeclaration(props?: object | null): asserts this is NodePath<t.TSInterfaceDeclaration>;

    assertTSIntersectionType(props?: object | null): asserts this is NodePath<t.TSIntersectionType>;

    assertTSLiteralType(props?: object | null): asserts this is NodePath<t.TSLiteralType>;

    assertTSMappedType(props?: object | null): asserts this is NodePath<t.TSMappedType>;

    assertTSMethodSignature(props?: object | null): asserts this is NodePath<t.TSMethodSignature>;

    assertTSModuleBlock(props?: object | null): asserts this is NodePath<t.TSModuleBlock>;

    assertTSModuleDeclaration(props?: object | null): asserts this is NodePath<t.TSModuleDeclaration>;

    assertTSNamespaceExportDeclaration(props?: object | null): asserts this is NodePath<t.TSNamespaceExportDeclaration>;

    assertTSNeverKeyword(props?: object | null): asserts this is NodePath<t.TSNeverKeyword>;

    assertTSNonNullExpression(props?: object | null): asserts this is NodePath<t.TSNonNullExpression>;

    assertTSNullKeyword(props?: object | null): asserts this is NodePath<t.TSNullKeyword>;

    assertTSNumberKeyword(props?: object | null): asserts this is NodePath<t.TSNumberKeyword>;

    assertTSObjectKeyword(props?: object | null): asserts this is NodePath<t.TSObjectKeyword>;

    assertTSOptionalType(props?: object | null): asserts this is NodePath<t.TSOptionalType>;

    assertTSParameterProperty(props?: object | null): asserts this is NodePath<t.TSParameterProperty>;

    assertTSParenthesizedType(props?: object | null): asserts this is NodePath<t.TSParenthesizedType>;

    assertTSPropertySignature(props?: object | null): asserts this is NodePath<t.TSPropertySignature>;

    assertTSQualifiedName(props?: object | null): asserts this is NodePath<t.TSQualifiedName>;

    assertTSRestType(props?: object | null): asserts this is NodePath<t.TSRestType>;

    assertTSStringKeyword(props?: object | null): asserts this is NodePath<t.TSStringKeyword>;

    assertTSSymbolKeyword(props?: object | null): asserts this is NodePath<t.TSSymbolKeyword>;

    assertTSThisType(props?: object | null): asserts this is NodePath<t.TSThisType>;

    assertTSTupleType(props?: object | null): asserts this is NodePath<t.TSTupleType>;

    assertTSType(props?: object | null): asserts this is NodePath<t.TSType>;

    assertTSTypeAliasDeclaration(props?: object | null): asserts this is NodePath<t.TSTypeAliasDeclaration>;

    assertTSTypeAnnotation(props?: object | null): asserts this is NodePath<t.TSTypeAnnotation>;

    assertTSTypeAssertion(props?: object | null): asserts this is NodePath<t.TSTypeAssertion>;

    assertTSTypeElement(props?: object | null): asserts this is NodePath<t.TSTypeElement>;

    assertTSTypeLiteral(props?: object | null): asserts this is NodePath<t.TSTypeLiteral>;

    assertTSTypeOperator(props?: object | null): asserts this is NodePath<t.TSTypeOperator>;

    assertTSTypeParameter(props?: object | null): asserts this is NodePath<t.TSTypeParameter>;

    assertTSTypeParameterDeclaration(props?: object | null): asserts this is NodePath<t.TSTypeParameterDeclaration>;

    assertTSTypeParameterInstantiation(props?: object | null): asserts this is NodePath<t.TSTypeParameterInstantiation>;

    assertTSTypePredicate(props?: object | null): asserts this is NodePath<t.TSTypePredicate>;

    assertTSTypeQuery(props?: object | null): asserts this is NodePath<t.TSTypeQuery>;

    assertTSTypeReference(props?: object | null): asserts this is NodePath<t.TSTypeReference>;

    assertTSUndefinedKeyword(props?: object | null): asserts this is NodePath<t.TSUndefinedKeyword>;

    assertTSUnionType(props?: object | null): asserts this is NodePath<t.TSUnionType>;

    assertTSUnknownKeyword(props?: object | null): asserts this is NodePath<t.TSUnknownKeyword>;

    assertTSVoidKeyword(props?: object | null): asserts this is NodePath<t.TSVoidKeyword>;

    assertTaggedTemplateExpression(props?: object | null): asserts this is NodePath<t.TaggedTemplateExpression>;

    assertTemplateElement(props?: object | null): asserts this is NodePath<t.TemplateElement>;

    assertTemplateLiteral(props?: object | null): asserts this is NodePath<t.TemplateLiteral>;

    assertTerminatorless(props?: object | null): asserts this is NodePath<t.Terminatorless>;

    assertThisExpression(props?: object | null): asserts this is NodePath<t.ThisExpression>;

    assertThisTypeAnnotation(props?: object | null): asserts this is NodePath<t.ThisTypeAnnotation>;

    assertThrowStatement(props?: object | null): asserts this is NodePath<t.ThrowStatement>;

    assertTryStatement(props?: object | null): asserts this is NodePath<t.TryStatement>;

    assertTupleTypeAnnotation(props?: object | null): asserts this is NodePath<t.TupleTypeAnnotation>;

    assertTypeAlias(props?: object | null): asserts this is NodePath<t.TypeAlias>;

    assertTypeAnnotation(props?: object | null): asserts this is NodePath<t.TypeAnnotation>;

    assertTypeCastExpression(props?: object | null): asserts this is NodePath<t.TypeCastExpression>;

    assertTypeParameter(props?: object | null): asserts this is NodePath<t.TypeParameter>;

    assertTypeParameterDeclaration(props?: object | null): asserts this is NodePath<t.TypeParameterDeclaration>;

    assertTypeParameterInstantiation(props?: object | null): asserts this is NodePath<t.TypeParameterInstantiation>;

    assertTypeofTypeAnnotation(props?: object | null): asserts this is NodePath<t.TypeofTypeAnnotation>;

    assertUnaryExpression(props?: object | null): asserts this is NodePath<t.UnaryExpression>;

    assertUnaryLike(props?: object | null): asserts this is NodePath<t.UnaryLike>;

    assertUnionTypeAnnotation(props?: object | null): asserts this is NodePath<t.UnionTypeAnnotation>;

    assertUpdateExpression(props?: object | null): asserts this is NodePath<t.UpdateExpression>;

    assertUserWhitespacable(props?: object | null): asserts this is NodePath<t.UserWhitespacable>;

    assertVariableDeclaration(props?: object | null): asserts this is NodePath<t.VariableDeclaration>;

    assertVariableDeclarator(props?: object | null): asserts this is NodePath<t.VariableDeclarator>;

    assertVariance(props?: object | null): asserts this is NodePath<t.Variance>;

    assertVoidTypeAnnotation(props?: object | null): asserts this is NodePath<t.VoidTypeAnnotation>;

    assertWhile(props?: object | null): asserts this is NodePath<t.While>;

    assertWhileStatement(props?: object | null): asserts this is NodePath<t.WhileStatement>;

    assertWithStatement(props?: object | null): asserts this is NodePath<t.WithStatement>;

    assertYieldExpression(props?: object | null): asserts this is NodePath<t.YieldExpression>;

    assertBindingIdentifier(props?: object | null): asserts this is NodePath<t.BindingIdentifier>;

    assertBlockScoped(props?: object | null): asserts this is NodePath<t.BlockScoped>;

    assertGenerated(props?: object | null): asserts this is NodePath<t.Generated>;

    assertPure(props?: object | null): asserts this is NodePath<t.Pure>;

    assertReferenced(props?: object | null): asserts this is NodePath<t.Referenced>;

    assertReferencedIdentifier(props?: object | null): asserts this is NodePath<t.ReferencedIdentifier>;

    assertReferencedMemberExpression(props?: object | null): asserts this is NodePath<t.ReferencedMemberExpression>;

    assertScope(props?: object | null): asserts this is NodePath<t.Scope>;

    assertUser(props?: object | null): asserts this is NodePath<t.User>;

    assertVar(props?: object | null): asserts this is NodePath<t.Var>;

    //#endregion
  }
}
