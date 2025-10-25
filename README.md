# Tree-sitter Grammar for Hebi

This directory contains a Tree-sitter grammar for the Hebi programming language.

## Structure

- `grammar.js` - The main grammar definition
- `package.json` - NPM package configuration
- `queries/highlights.scm` - Syntax highlighting queries

## Building

To generate the parser:

```bash
cd grammar
npm install
npx tree-sitter generate
```

## Testing

To test the grammar against example files:

```bash
npx tree-sitter parse ../tests/inputs/syntax/fact.hi
```

## Grammar Overview

The Hebi language is a dynamically-typed scripting language with:

- **Variables**: `let x = 10`
- **Functions**: `fn name(params) { body }`
- **Control flow**: `if`, `else`, `loop`, `break`, `continue`, `return`
- **Expressions**: Binary/unary operations, calls, field access, indexing
- **Data structures**: Lists `[1, 2, 3]` and tables `{key: value}`
- **Literals**: Integers, floats, strings, booleans, nil

## Node Types

The grammar produces an AST with the following node types:

### Statements
- `variable_declaration` - `let` statements
- `function_declaration` - Named function declarations
- `loop_statement` - Infinite loops
- `expression_statement` - Expression used as statement

### Expressions
- `return_expression`, `break_expression`, `continue_expression`
- `if_expression` - Multi-branch conditionals
- `do_expression` - Block expressions
- `anonymous_function` - Function literals
- `assignment_expression` - Assignment with operators
- `binary_expression` - Binary operations
- `unary_expression` - Unary operations
- `call_expression` - Function calls
- `index_expression` - Array/table indexing
- `field_expression` - Field access
- `list_expression` - List literals
- `table_expression` - Table literals
- `parenthesized_expression` - Grouped expressions

### Literals
- `integer`, `float`, `string`, `boolean`, `nil`, `identifier`
