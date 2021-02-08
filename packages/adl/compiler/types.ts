import { SymbolTable } from './binder';

/**
 * Type System types
 */
export interface BaseType {
  kind: string;
  node: Node;
  instantiationParameters?: Array<Type>;
}

export type Type =
  | ModelType
  | ModelTypeProperty
  | TemplateParameterType
  | Namespace
  | NamespaceProperty
  | StringLiteralType
  | NumericLiteralType
  | BooleanLiteralType
  | ArrayType
  | TupleType
  | UnionType;

export interface ModelType extends BaseType {
  kind: 'Model';
  name: string;
  properties: Map<string, ModelTypeProperty>;
  ownProperties: Map<string, ModelTypeProperty>;
  baseModels: Array<ModelType>;
  templateArguments?: Array<Type>;
  templateNode?: Node;
  assignmentType?: Type;
}

export interface ModelTypeProperty {
  kind: 'ModelProperty';
  node: ModelPropertyNode | ModelSpreadPropertyNode;
  name: string;
  type: Type;
  optional: boolean;
}

export interface NamespaceProperty {
  kind: 'NamespaceProperty';
  node: NamespacePropertyNode;
  name: string;
  parameters?: ModelType;
  returnType: Type;
}

export interface Namespace extends BaseType {
  kind: 'Namespace';
  name: string;
  node: NamespaceStatementNode;
  properties: Map<string, NamespaceProperty>;
  parameters?: ModelType;
}

export type LiteralType = StringLiteralType | NumericLiteralType | BooleanLiteralType;

export interface StringLiteralType extends BaseType {
  kind: 'String';
  node: StringLiteralNode;
  value: string;
}

export interface NumericLiteralType extends BaseType {
  kind: 'Number';
  node: NumericLiteralNode;
  value: number;
}

export interface BooleanLiteralType extends BaseType {
  kind: 'Boolean';
  node: BooleanLiteralNode;
  value: boolean;
}

export interface ArrayType extends BaseType {
  kind: 'Array';
  node: ArrayExpressionNode;
  elementType: Type;
}

export interface TupleType extends BaseType {
  kind: 'Tuple';
  node: TupleExpressionNode;
  values: Array<Type>;
}

export interface UnionType extends BaseType {
  kind: 'Union';
  options: Array<Type>;
}

export interface TemplateParameterType extends BaseType {
  kind: 'TemplateParameter';
}


/**
 * AST types
 */
export enum SyntaxKind {
  ADLScript,
  ImportStatement,
  Identifier,
  NamedImport,
  DecoratorExpression,
  MemberExpression,
  NamespaceStatement,
  NamespaceProperty,
  ModelStatement,
  ModelExpression,
  ModelProperty,
  ModelSpreadProperty,
  UnionExpression,
  IntersectionExpression,
  TupleExpression,
  ArrayExpression,
  StringLiteral,
  NumericLiteral,
  BooleanLiteral,
  TemplateApplication,
  TemplateParameterDeclaration
}

export interface Node {
  kind: SyntaxKind;
  pos: number;
  end: number;
  parent?: Node;
}

export interface ADLScriptNode extends Node {
  kind: SyntaxKind.ADLScript;
  statements: Array<Statement>;
}

export type Statement =
  | ImportStatementNode
  | ModelStatementNode
  | NamespaceStatementNode;

export interface ImportStatementNode extends Node {
  kind: SyntaxKind.ImportStatement;
  id: IdentifierNode;
  as: Array<NamedImportNode>;
}

export interface IdentifierNode extends Node {
  kind: SyntaxKind.Identifier;
  sv: string;
}

export interface NamedImportNode extends Node {
  kind: SyntaxKind.NamedImport;
  id: IdentifierNode;
}

export interface DecoratorExpressionNode extends Node {
  kind: SyntaxKind.DecoratorExpression;
  target: IdentifierNode | MemberExpressionNode;
  arguments: Array<Expression>;
}

export type Expression =
  | ArrayExpressionNode
  | MemberExpressionNode
  | ModelExpressionNode
  | TupleExpressionNode
  | UnionExpressionNode
  | IntersectionExpressionNode
  | TemplateApplicationNode
  | IdentifierNode
  | StringLiteralNode
  | NumericLiteralNode
  | BooleanLiteralNode;

export interface MemberExpressionNode extends Node {
  kind: SyntaxKind.MemberExpression;
  id: IdentifierNode;
  base: MemberExpressionNode | IdentifierNode;
}

export interface NamespaceStatementNode extends Node {
  kind: SyntaxKind.NamespaceStatement;
  id: IdentifierNode;
  parameters?: ModelExpressionNode;
  properties: Array<NamespacePropertyNode>;
  decorators: Array<DecoratorExpressionNode>;
}

export interface NamespacePropertyNode extends Node {
  kind: SyntaxKind.NamespaceProperty;
  id: IdentifierNode;
  parameters: ModelExpressionNode;
  returnType: Expression;
  decorators: Array<DecoratorExpressionNode>;
}


export interface ModelStatementNode extends Node {
  kind: SyntaxKind.ModelStatement;
  id: IdentifierNode;
  properties?: Array<ModelPropertyNode | ModelSpreadPropertyNode>;
  assignment?: Expression;
  templateParameters: Array<TemplateParameterDeclarationNode>;
  locals?: SymbolTable;
  decorators: Array<DecoratorExpressionNode>;
}

export interface ModelExpressionNode extends Node {
  kind: SyntaxKind.ModelExpression;
  properties: Array<ModelPropertyNode | ModelSpreadPropertyNode>;
  decorators: Array<DecoratorExpressionNode>;
}

export interface ArrayExpressionNode extends Node {
  kind: SyntaxKind.ArrayExpression;
  elementType: Expression;
}
export interface TupleExpressionNode extends Node {
  kind: SyntaxKind.TupleExpression;
  values: Array<Expression>;
}

export interface ModelPropertyNode extends Node {
  kind: SyntaxKind.ModelProperty;
  id: IdentifierNode | StringLiteralNode;
  value: Expression;
  decorators: Array<DecoratorExpressionNode>;
  optional: boolean;
}

export interface ModelSpreadPropertyNode extends Node {
  kind: SyntaxKind.ModelSpreadProperty;
  target: IdentifierNode;
}

export type LiteralNode = StringLiteralNode | NumericLiteralNode | BooleanLiteralNode;

export interface StringLiteralNode extends Node {
  kind: SyntaxKind.StringLiteral;
  value: string;
}

export interface NumericLiteralNode extends Node {
  kind: SyntaxKind.NumericLiteral;
  value: number;
}

export interface BooleanLiteralNode extends Node {
  kind: SyntaxKind.BooleanLiteral;
  value: boolean;
}

export interface UnionExpressionNode extends Node {
  kind: SyntaxKind.UnionExpression;
  options: Array<Expression>;
}

export interface IntersectionExpressionNode extends Node {
  kind: SyntaxKind.IntersectionExpression;
  options: Array<Expression>;
}

export interface TemplateApplicationNode extends Node {
  kind: SyntaxKind.TemplateApplication;
  target: Expression;
  arguments: Array<Expression>;
}

export interface TemplateParameterDeclarationNode extends Node {
  kind: SyntaxKind.TemplateParameterDeclaration;
  sv: string;
}

/**
 * Identifies the position within a source file by line number and offset from
 * beginning of line.
 */
export interface LineAndCharacter {
  /** The line number. 0-based. */
  line: number;

  /**
   * The offset in UTF-16 code units to the character from the beginning of the
   * line. 0-based.
   *
   * NOTE: This is not necessarily the same as what a given text editor might
   * call the "column". Tabs, combining characters, surrogate pairs, and so on
   * can all cause an editor to report the column differently. Indeed, different
   * text editors report different column numbers for the same position in a
   * given document.
   */
  character: number;
}

export interface SourceFile {
  /** The source code text. */
  readonly text: string;

  /**
   * The source file path.
   *
   * This is used only for diagnostics. The command line compiler will populate
   * it with the actual path from which the file was read, but it can actually
   * be an aribitrary name for other scenarios.
   */
  readonly path: string;

  /**
   * Array of positions in the text where each line begins. There is one entry
   * per line, in order of lines, and each entry represents the offset in UTF-16
   * code units from the start of the document to the beginning of the line.
   */
  getLineStarts(): ReadonlyArray<number>;

  /**
   * Converts a one-dimensional position in the document (measured in UTF-16
   * code units) to line number and offset from line start.
   */
  getLineAndCharacterOfPosition(position: number): LineAndCharacter;
}

