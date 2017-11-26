// @flow
import { parseQAP } from './parsing'

// Referencing https://github.com/ethereum/research/blob/master/zksnark/qap_creator.py

// Polynomials are stored as arrays, where the ith element in
// the array is the ith degree coefficient
// e.g. [1, 5, 4, 3, 2] = 1 + 5x + 4x^2 + 3x^3 + 2x^4
type polynomial = number[]
type matrix = polynomial[]

// Zip array to longest
const zipLongest = (placeholder: number = 0, ...arrays): Array<number>[] => {
  const length = Math.max(...arrays.map(arr => arr.length))
  return Array.from(
    { length }, (value, index) => arrays.map(
      array => array.length - 1 >= index ? array[index] : placeholder
    )
  )
}

// Multiply two polynomial
const multiplyPoly = (a: polynomial, b: polynomial): polynomial => {
  let acc: polynomial = Array.from({length: a.length + b.length - 1}, i => 0)

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      acc[i + j] += a[i] * b[j]
    }
  }

  return acc
}

// Add two polynomials
const addPoly = (a: polynomial, b: polynomial): polynomial => {
  return zipLongest(0, a, b).map(x => x[0] + x[1])
}

// Subtract polynomials
const subtractPoly = (a: polynomial, b: polynomial): polynomial => {
  return zipLongest(0, a, b).map(x => x[0] - x[1])
}

// Divide a/b polynomial, return quotient and remainder
const divPoly = (a: polynomial, b: polynomial): [polynomial, polynomial] => {
  let o: polynomial = Array.from({length: a.length - b.length + 1}, i => 0)
  let remainder: polynomial = a

  while (remainder.length >= b.length) {
    let leadingFac = remainder[remainder.length - 1] / b[b.length - 1]
    let pos = remainder.length - b.length
    o[pos] = leadingFac
    remainder = subtractPoly(remainder, multiplyPoly(b, Array.from({length: pos}, i => 0).concat(leadingFac)))
    remainder.pop()
  }

  return [o, remainder]
}

// Evaluate polynomial at a point
const evalPoly = (poly: polynomial, x: number): number => {
  return poly.map((p, i) => p * (x ** i)).reduce((a, b) => a + b, 0)
}

// Make a Polynomial which is zero at {1, 2, .. total_pts}, except
// for `point_loc` where the value is `height`
const mkSingleton = (pointLoc: number, height: number, totalPts: number): polynomial => {
  const idx = Array.from({length: totalPts}, (_, i) => i + 1)
  const fac = idx.reduce((a, b) => a * (b === pointLoc ? 1 : pointLoc - b), 1)

  return idx.reduce((a, b) => b === pointLoc ? a : multiplyPoly(a, [-b, 1]), [height * 1.0 / fac])
}

// Transpose a matrix
const transpose = (m: matrix): matrix => {
  return zipLongest(0, ...m)
}

// Lagrange Interpolation
// Assumes poly[0] = p(1), poly[1] = p(2) ..., tries to find p
// Reults expressed as [deg 0 coeff, def 1 coeff...]
const lagrangeInterpolation = (poly: polynomial): polynomial => {
  const p: polynomial = poly.reduce((acc, x, i) => addPoly(acc, mkSingleton(i + 1, x, poly.length)), [])

  for (let i = 0; i < poly.length; i++) {
    if (Math.abs(evalPoly(p, i + 1) - poly[i]) > 10 ** -10) {
      throw new Error('Error calculating lagrange: ' + (p, evalPoly(p, i), i + 1))
    }
  }

  return p
}

// Converts r1cs to qap
// r1cs = Rank 1 constraint system
const r1csToQap = (A: matrix, B: matrix, C: matrix): [matrix, matrix, matrix, polynomial] => {
  const newA: matrix = transpose(A).map((x) => lagrangeInterpolation(x))
  const newB: matrix = transpose(B).map((x) => lagrangeInterpolation(x))
  const newC: matrix = transpose(C).map((x) => lagrangeInterpolation(x))

  // Z = (x - 1) * (x - 2) ... (x - N) where N is the length of the polynomial
  const Z: polynomial = Array.from({length: transpose(A)[0].length}, (_, i) => i + 1)
    .reduce((acc, x) => multiplyPoly(acc, [-x, 1]), [1])

  return [newA, newB, newC, Z]
}

// This picture might better illustrate the process: https://cdn-images-1.medium.com/max/800/1*wp6bmXoPEU_zZHzJFRq6IQ.png
// Only thing is that its doing all the R1CS at the same time
// A * B - C = H * Z
const createSolutionPolynomials = (r: polynomial, newA: matrix, newB: matrix, newC: matrix): [polynomial, polynomial, polynomial, polynomial] => {
  const Apoly: polynomial = zipLongest(0, r, newA).reduce((acc, x) => addPoly(acc, multiplyPoly([x[0]], x[1])), [])
  const Bpoly: polynomial = zipLongest(0, r, newB).reduce((acc, x) => addPoly(acc, multiplyPoly([x[0]], x[1])), [])
  const Cpoly: polynomial = zipLongest(0, r, newC).reduce((acc, x) => addPoly(acc, multiplyPoly([x[0]], x[1])), [])
  const H: polynomial = subtractPoly(multiplyPoly(Apoly, Bpoly), Cpoly)

  for (let i = 1; i < newA[0].length + 1; i++) {
    if (Math.abs(evalPoly(H, i) > 10 ** -10)) {
      throw new Error('Error creating poly solution: ' + (evalPoly(H, i), i))
    }
  }

  return [Apoly, Bpoly, Cpoly, H]
}

export {
  zipLongest,
  evalPoly,
  addPoly,
  subtractPoly,
  multiplyPoly,
  divPoly,
  createSolutionPolynomials,
  r1csToQap,
  mkSingleton,
  transpose,
  lagrangeInterpolation
}
