module.exports = grammar({
  name: 'hebi',

  extras: $ => [
    /[ \t\r\n\f]+/,
    $.comment,
    $.shebang,
  ],

  rules: {
    source_file: $ => repeat($._statement),

    // Statements
    _statement: $ => choice(
      $.import_statement,
      $.variable_declaration,
      $.function_declaration,
      $.loop_statement,
      $.while_statement,
      $.expression_statement,
    ),

    import_statement: $ => choice(
      // import IDENT
      seq(
        'import',
        field('name', $.identifier),
      ),
      // import IDENT from STRING|IDENT
      seq(
        'import',
        field('name', $.identifier),
        'from',
        field('source', choice($.string, $.identifier)),
      ),
      // import { import_item,+ } from STRING|IDENT
      seq(
        'import',
        '{',
        field('imports', $.import_specifiers),
        '}',
        'from',
        field('source', choice($.string, $.identifier)),
      ),
    ),

    import_specifiers: $ => seq(
      $.import_specifier,
      repeat(seq(',', $.import_specifier)),
      optional(','),
    ),

    import_specifier: $ => seq(
      field('name', $.identifier),
      optional(seq('as', field('alias', $.identifier))),
    ),

    variable_declaration: $ => seq(
      'let',
      field('name', $.identifier),
      '=',
      field('value', $._expression),
    ),

    function_declaration: $ => seq(
      'fn',
      field('name', $.identifier),
      field('parameters', $.parameter_list),
      field('body', $.block),
    ),

    parameter_list: $ => seq(
      '(',
      optional(seq(
        $.identifier,
        repeat(seq(',', $.identifier)),
        optional(','),
      )),
      ')',
    ),

    loop_statement: $ => seq(
      'loop',
      field('body', $.block),
    ),

    while_statement: $ => seq(
      'while',
      field('condition', $._expression),
      field('body', $.block),
    ),

    expression_statement: $ => choice(
      $._expression,
    ),

    block: $ => seq(
      '{',
      repeat($._statement),
      '}',
    ),

    // Expressions
    _expression: $ => choice(
      $.return_expression,
      $.break_expression,
      $.continue_expression,
      $.if_expression,
      $.do_expression,
      $.anonymous_function,
      $.assignment_expression,
      $.binary_expression,
      $.unary_expression,
      $.call_expression,
      $.index_expression,
      $.field_expression,
      $.list_expression,
      $.table_expression,
      $.integer,
      $.float,
      $.boolean,
      $.string,
      $.nil,
      $.identifier,
      $.parenthesized_expression,
    ),

    // Expressions that can follow return (excludes anonymous functions)
    _return_value_expression: $ => choice(
      $.if_expression,
      $.do_expression,
      $.assignment_expression,
      $.binary_expression,
      $.unary_expression,
      $.call_expression,
      $.index_expression,
      $.field_expression,
      $.list_expression,
      $.table_expression,
      $.integer,
      $.float,
      $.boolean,
      $.string,
      $.nil,
      $.identifier,
      $.parenthesized_expression,
    ),

    return_expression: $ => prec.right(seq(
      'return',
      optional($._return_value_expression),
    )),

    break_expression: $ => token('break'),

    continue_expression: $ => token('continue'),

    if_expression: $ => seq(
      'if',
      field('condition', $._expression),
      field('consequence', $.block),
      repeat(seq(
        'else',
        'if',
        field('condition', $._expression),
        field('consequence', $.block),
      )),
      optional(seq(
        'else',
        field('alternative', $.block),
      )),
    ),

    do_expression: $ => seq(
      'do',
      $.block,
    ),

    anonymous_function: $ => seq(
      'fn',
      optional(field('name', $.identifier)),
      field('parameters', $.parameter_list),
      field('body', $.block),
    ),

    assignment_expression: $ => prec.right(1, seq(
      field('left', choice(
        $.identifier,
        $.field_expression,
        $.index_expression,
      )),
      field('operator', choice('=', '+=', '-=', '*=', '/=', '%=')),
      field('right', $._expression),
    )),

    binary_expression: $ => choice(
      ...[
        ['or', 2],
        ['and', 3],
        [choice('==', '!='), 4],
        [choice('>', '>=', '<', '<='), 5],
        [choice('+', '-'), 6],
        [choice('*', '/', '%'), 7],
      ].map(([operator, precedence]) =>
        prec.left(precedence, seq(
          field('left', $._expression),
          field('operator', operator),
          field('right', $._expression),
        ))
      )
    ),

    unary_expression: $ => prec(8, seq(
      field('operator', choice('-', 'not')),
      field('operand', $._expression),
    )),

    call_expression: $ => prec(10, seq(
      field('function', $._expression),
      field('arguments', $.argument_list),
    )),

    argument_list: $ => seq(
      '(',
      optional(seq(
        $._expression,
        repeat(seq(',', $._expression)),
        optional(','),
      )),
      ')',
    ),

    index_expression: $ => prec(10, seq(
      field('object', $._expression),
      '[',
      field('index', $._expression),
      ']',
    )),

    field_expression: $ => prec(10, seq(
      field('object', $._expression),
      '.',
      field('field', alias($.identifier, $.field_identifier)),
    )),

    list_expression: $ => seq(
      '[',
      optional(seq(
        $._expression,
        repeat(seq(',', $._expression)),
        optional(','),
      )),
      ']',
    ),

    table_expression: $ => seq(
      '{',
      optional(seq(
        $.table_entry,
        repeat(seq(',', $.table_entry)),
        optional(','),
      )),
      '}',
    ),

    table_entry: $ => choice(
      seq(
        field('key', choice(alias($.identifier, $.field_identifier), $.string)),
        ':',
        field('value', $._expression),
      ),
      // Shorthand syntax: {a} is equivalent to {a: a}
      field('key', alias($.identifier, $.field_identifier)),
    ),

    parenthesized_expression: $ => seq(
      '(',
      $._expression,
      ')',
    ),

    // Literals
    identifier: $ => /[a-zA-Z_][a-zA-Z_0-9]*/,

    integer: $ => token(choice(
      '0',
      /[1-9][0-9]*(_?[0-9])*/,
    )),

    float: $ => token(
      seq(
        choice('0', /[1-9][0-9]*/),
        optional(seq('.', /[0-9]+/)),
        optional(seq(/[Ee]/, optional(/[+-]/), /[0-9]+/)),
      )
    ),

    string: $ => seq(
      token('"'),
      repeat(choice(
        /[^"\\]/,
        $.escape_sequence,
      )),
      token.immediate('"'),
    ),

    escape_sequence: $ => token.immediate(seq(
      '\\',
      choice(
        /[rtn"\\]/,
        /x[0-9a-fA-F]{2}/,
        /u\{[0-9a-fA-F]+\}/,
      ),
    )),

    boolean: $ => choice('true', 'false'),

    nil: $ => token('nil'),

    // Comments
    comment: $ => token(seq('//', /[^\n]*/)),

    shebang: $ => token(seq('#!', /[^\n]*/)),
  },

  conflicts: $ => [
    // Function declaration vs. anonymous function in statement position
    [$.function_declaration, $.anonymous_function],
    // Return value expression ambiguity
    [$._expression, $._return_value_expression],
  ],

  word: $ => $.identifier,
});
