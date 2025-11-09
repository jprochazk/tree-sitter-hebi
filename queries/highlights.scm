;;; Highlighting for hebi

;; Keywords

(import_statement
  "import" @keyword.control.import)

(import_statement
  "as" @keyword.control.import)

(import_statement
  "from" @keyword.control.import)

(if_expression
  "if" @keyword.control.conditional)

(if_expression
  "else" @keyword.control.conditional)

(loop_statement
[
  "loop"
] @keyword.control.repeat)

(return_expression
  "return" @keyword.control.return)

[
  (break_expression)
  (continue_expression)
] @keyword.control

(do_expression
  "do" @keyword)

(variable_declaration
  "let" @keyword)

(function_declaration
  "fn" @keyword.function)

(anonymous_function
  "fn" @keyword.function)

;; Import identifiers
(import_statement
  alias: (identifier) @variable)

(import_specifier
  name: (identifier) @variable)

(import_specifier
  alias: (identifier) @variable)

;; Operators

[
  "not"
  "and"
  "or"
] @keyword.operator

[
  "="
  "+="
  "-="
  "*="
  "/="
  "=="
  "!="
  "<="
  ">="
  "<"
  ">"
  "+"
  "-"
  "*"
  "/"
] @operator

;; Punctuation
[","  "." ":"] @punctuation.delimiter

;; Brackets

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

;; Variables
(identifier) @variable

;; Constants
[
  (boolean)
] @constant.builtin.boolean

(nil) @constant.builtin

;; Tables

(table_entry
  key: (field_identifier) @variable.other.member)

(table_entry
  key: (string) @variable.other.member)

;; Functions

(parameter_list
  (identifier) @variable.parameter)

(function_declaration
  name: (identifier) @function)

(assignment_expression
  left: (identifier) @function
  right: (anonymous_function))

;; Property/Field access
;; NOTE: Must appear before `call_expression` below
(field_expression
  field: (field_identifier) @variable.other.member)

;; Function/method calls
(call_expression
  function: [
    ((identifier) @function)
    (field_expression
      field: (field_identifier) @function)
  ])

;; Literals
(comment) @comment
(shebang) @comment

(string) @string
(escape_sequence) @constant.character.escape

(integer) @constant.numeric.integer
(float) @constant.numeric.float

;; Errors
(ERROR) @error

