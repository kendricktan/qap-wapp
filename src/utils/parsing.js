// @flow

// Finds content within brackets
const locateBrackets = (expression: string): string[] => {
  let startIndex = -1
  let count = 0 // Bracket count
  let content: string[] = []

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === '(') {
      count = count + 1
      if (startIndex === -1) {
        startIndex = i
      }
    } else if (expression[i] === ')') {
      count = count - 1

      if (count === 0) {
        content = content.concat(expression.substring(startIndex, i + 1))
        startIndex = -1
      } else if (count < 0) {
        throw new Error('Bracket parsing error')
      }
    }
  }

  return content
}

// Replace brackets
const parseBrackets = (expression: string, symbols: Object, symI: number = 1): [string, Object, number] => {
  // Regex to extract stuff in brackets
  let newExpr, newSymbols
  let bracketContent = locateBrackets(expression)

  for (let i = 0; i < bracketContent.length; i++) {
    // Current expression (e.g. (x^2+1))
    // Split to remove brackets
    let expr = bracketContent[i].slice(1, -1)

    // If there's a nested bracket within the expression
    // Evaluate that first
    if (expr.indexOf('(') !== -1) {
      [newExpr, newSymbols, symI] = parseBrackets(expr, symbols, symI)

      // Reassign all existing symbols
      symbols = Object.assign(symbols, newSymbols)

      // Replace all symbols in expression
      expression = Object.keys(symbols).reduce((acc, s) => {
        return acc.split('(' + s + ')').join(symbols[s])
      }, expression)

      // Replace all content
      bracketContent = bracketContent.map((x) => {
        return Object.keys(symbols).reduce((acc, s) => {
          return acc.split('(' + s + ')').join(symbols[s])
        }, x)
      })

      // Replace existing content
      expr = bracketContent[i].slice(1, -1)
    }

    // Check symbol existence
    if (symbols[expr] === undefined) {
      const sym = 'sym_' + (symI++).toString()
      symbols[expr] = sym

      // Replace expression with symbol
      expression = expression.split(expr).join(sym)
    } else {
      const sym = symbols[expr]
      expression = expression.split(expr).join(sym)
    }
  }

  return [expression, symbols, symI]
}

// Once we're done with that,
// We start off by replacing the x^CONSTANT
// with a var_i (where _i is just an index)
const parseExponents = (expression: string, symbols: Object): [string, Object] => {
  let varI = 1
  const reExponent = /x\^(\d*\.?\d*)/g

  let exponentSymbols = Object.keys(symbols).reduce((acc, e) => {
    // Get current exponents
    let exponents = e.match(reExponent)

    if (exponents === null) {
      return acc
    }

    // Loop through each exponents and replace with VAR
    for (let i = 0; i < exponents.length; i++) {
      let curExponent = exponents[i]
      const varSym = 'var_' + (varI++).toString()

      if (acc[curExponent] === undefined) {
        acc[curExponent] = varSym
      }

      // At the same time replace variable assignment for all existing exponent
      // in the current object key
      const k = Object.keys(acc).reduce((acc2, s) => acc2.split(s).join(acc[s]), e)
      acc[k] = symbols[e]
    }

    return acc
  }, {})

  // Remove duplicates
  let symbolsCopy = JSON.parse(JSON.stringify(symbols))

  for (var k in exponentSymbols) {
    const sym = exponentSymbols[k]

    // Update var in expression
    expression = expression.split(k).join(sym)

    for (var k2 in symbolsCopy) {
      if (symbolsCopy[k2] === sym) {
        delete symbolsCopy[k2]
      }
    }
  }

  return [expression, Object.assign(exponentSymbols, symbolsCopy)]
}

// AST and Symbols to keep track of the stuff we've parsed
let symbols = {} // symbol['x^2+1'] = 'sym_1' or smthg
let expression = `x +((x^2-6) * (x^2+(3*x-5)-(5*x))) + x^2= 35`.replace(/\s/g, '')
console.log(expression);

// Extract content from brackets
[expression, symbols] = parseBrackets(expression, symbols)
expression = expression.split('(').join('').split(')').join('');
[expression, symbols] = parseExponents(expression, symbols)

console.log(expression)
console.log(symbols)
