// @flow
import mathjs from 'mathjs'

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

  if (count !== 0) {
    throw new Error('Bracket parsing error')
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
      bracketContent = locateBrackets(expression)

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

      if (acc[curExponent] === undefined) {
        acc[curExponent] = 'var_' + (varI++).toString()
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

  // Parse the expression
  const expExponents = expression.match(reExponent)

  if (expExponents !== null) {
    for (let i = 0; i < expExponents.length; i++) {
      const exp = expExponents[i]

      if (exponentSymbols[exp] === undefined) {
        const sym = 'var_' + (varI++).toString()
        expression = expression.split(exp).join(sym)
        exponentSymbols[exp] = sym
      }
    }
  }

  return [expression, Object.assign(exponentSymbols, symbolsCopy)]
}

const parseExpression = (expression: string, symbols: Object, idx: number, regex: RegExp) => {
  // Apply on symbols
  // Find out how many operations there are
  // If there's > 1 then apply the parseExpression
  const operationsRegex = /[+-/*]/g

  symbols = JSON.parse(JSON.stringify(symbols))
  for (let k in symbols) {
    // How many operations are there
    // in the symbols
    let sym = k.match(operationsRegex)

    if (sym !== null) {
      // If there's more than one operation
      // Then we wanna reduce that to 1
      if (sym.length > 1) {
        let symExp = k.match(regex)
        let newK

        // If current regex doesn't find the correct operation
        // then continue
        if (symExp === null) {
          continue
        }

        // Else try and replace it
        symExp = symExp[0]
        if (symbols[symExp] === undefined) {
          const rep = 'rep_' + (idx++).toString()
          newK = k.split(symExp).join(rep)

          symbols[symExp] = rep
          symbols[newK] = symbols[k]

          delete symbols[k]
        } else {
          const rep = symbols[symExp]
          newK = k.split(symExp).join(rep)

          symbols[symExp] = rep
          symbols[newK] = symbols[k]

          delete symbols[k]
        }

        if (newK.match(operationsRegex) !== null) {
          if (newK.match(operationsRegex.length) > 1) {
            return parseExpression(expression, symbols, idx, regex)
          }
        }
      }
    }
  }

  // Apply on expression
  let exp = expression.match(regex)
  if (exp !== null) {
    exp = exp[0]

    if (symbols[exp] === undefined) {
      const rep = 'rep_' + (idx++).toString()
      symbols[exp] = rep
      expression = expression.split(exp).join(rep)
    } else {
      const rep = symbols[exp]
      expression = expression.split(exp).join(rep)
    }

    // If there still is another multi/div expression
    // Apply it again
    if (expression.match(regex) !== null) {
      return parseRepresentation(expression, symbols, idx)
    }
  }

  return [expression, symbols, idx]
}

const parseRepresentation = (expression: string, symbols: Object, repI: number = 1) => {
  // Replace all the multiplication and division with expressions first
  const mulDivExp = /[A-Za-z\d_]*[*|\/][A-Za-z\d_]*/g
  const subAddExp = /[A-Za-z\d_]*[+|-][A-Za-z\d_]*/g;

  // Parse on mutliplication and division
  [expression, symbols, repI] = parseExpression(expression, symbols, repI, mulDivExp);
  [expression, symbols, repI] = parseExpression(expression, symbols, repI, subAddExp)

  return [expression, symbols, repI]
}

// Cleans duplicates from symbol
// Also replaces rep_i with out for final out
const cleanSymbols = (finalExpression: string, symbols: Object): Object => {
  const hasOperation = /[+-/*^]/g

  for (var k in symbols) {
    // If this key has no operations
    // Remove it from symbol, and remap
    // All symbols
    if (k.match(hasOperation) === null) {
      let newSymbol = Object.keys(symbols).reduce((acc, k2) => {
        if (k2 === k) {
          return acc
        }
        if (symbols[k2] === finalExpression) {
          acc[k2.split(symbols[k]).join(k)] = 'out'
        } else {
          acc[k2.split(symbols[k]).join(k)] = symbols[k2]
        }
        return acc
      }, {})
      return cleanSymbols(finalExpression, newSymbol)
    }

    // Also wanna map output
    if (symbols[k] === finalExpression) {
      symbols[k] = 'out'
    }
  }

  return symbols
}

// Turns keys to be values
// And values to be keys
const reverseObject = (o: Object): Object => {
  return Object.keys(o).reduce((acc, k) => {
    acc[o[k]] = k
    return acc
  }, {})
}

const evalSymbolsAt = (x: number, symbols: Object): Object => {
  // Reverse keys to be values and values
  // To be keys
  // Legacy stuff, ignore, can't be stuffed renaming
  // all variables. Also copy var instead of overwriting it
  let symbolsReversed = JSON.parse(JSON.stringify(symbols))

  // Get max i for var_i, rep_i, sym_i
  const limitI = Object.keys(symbolsReversed).reduce((acc, k) => {
    if (k !== 'out') {
      const e = k.split('_')
      if (parseFloat(e[1]) > acc[e[0]]) {
        acc[e[0]] = parseFloat(e[1])
      }
    }
    return acc
  }, {'var': 0, 'sym': 0, 'rep': 0})

  // Eval for x
  symbolsReversed['x'] = x

  // Eval for var
  for (let i = 1; i <= limitI.var; i++) {
    const key = 'var_' + i.toString()
    const expr = symbolsReversed[key]

    if (expr !== undefined) {
      symbolsReversed[key] = mathjs.eval(expr.split('x').join(x))
    }
  }

  // Eval for sym and repr
  let evalFinished = false

  while (!evalFinished) {
    ['sym', 'rep'].forEach((rs) => {
      const limit = limitI[rs]
      for (let i = 1; i <= limit; i++) {
        const key = rs + '_' + i.toString()
        const expr = symbolsReversed[key]

        if (expr !== undefined) {
          if (typeof (expr) === 'string') {
            // Replace 'var_1' etc with real values
            const formatExpr = Object.keys(symbolsReversed).reduce((acc, k) => acc.split(k).join(symbolsReversed[k]), expr)

            // Can't eval symbols
            if (formatExpr.indexOf('_') === -1) {
              symbolsReversed[key] = mathjs.eval(formatExpr.split('x').join(x))
            }
          }
        }
      }
    })

    evalFinished = Object.keys(symbolsReversed).reduce((acc, k) => {
      if (k !== 'out' && k !== 'x' && isNaN(parseFloat(symbolsReversed[k]))) {
        return false
      }
      return acc
    }, true)
  }

  // Eval out
  const oExpr = symbolsReversed['out']
  if (oExpr !== undefined) {
    const formatOExpr = Object.keys(symbolsReversed).reduce((acc, k) => acc.split(k).join(symbolsReversed[k]), oExpr)
    symbolsReversed['out'] = mathjs.eval(formatOExpr.split('x').join(x))
  }

  return symbolsReversed
}

const parseSymbols = (expression: string): Object => {
  // Symbols to keep track of the stuff we've parsed
  let _
  let symbols = {} // symbol['x^2+1'] = 'sym_1' or smthg

  // Replace whitespace and format '**' to '^'
  expression = expression.replace(/\s/g, '').split('**').join('^');

  // Extract content from brackets
  [expression, symbols] = parseBrackets(expression, symbols)

  expression = expression.split('(').join('').split(')').join('');
  [expression, symbols] = parseExponents(expression, symbols);
  [expression, symbols, _] = parseRepresentation(expression, symbols)
  symbols = cleanSymbols(expression, symbols)

  let symbolsReversed = reverseObject(symbols)
  symbolsReversed['x'] = 'x'
  symbolsReversed['one'] = 1

  return symbolsReversed
}

// let sym = parseSymbols('x-5*(x^6-(x^2))')
// let symEval = evalSymbolsAt(3, sym)
// console.log(sym)
// console.log(symEval)

export {
  parseSymbols,
  evalSymbolsAt
}
