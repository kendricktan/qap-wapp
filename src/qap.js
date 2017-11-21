// @flow

// Referencing https://github.com/ethereum/research/blob/master/zksnark/qap_creator.py

// Polynomials are stored as arrays, where the ith element in
// the array is the ith degree coefficient
// e.g. [1, 5, 4, 3, 2] = 1 + 5x + 4x^2 + 3x^3 + 2x^4
type polynomial = number[]

// Zip array to longest
const zipLongest = (placeholder: number = 0, ...arrays): Array<number>[] => {
    const length = Math.max(...arrays.map(arr => arr.length));
    return Array.from(
        { length }, (value, index) => arrays.map(
            array => array.length - 1 >= index ? array[index] : placeholder
        )
    );
};

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
    return poly.map((p, i) => p * (x**i)).reduce((a, b) => a + b, 0)
}

// Make a Polynomial which is zero at {1, 2, .. total_pts}, except
// for `point_loc` where the value is `height`
const mkSingleton = (pointLoc: number, height: number, totalPts: number): polynomial => {
    const idx = Array.from({length: totalPts}, (_, i) => i + 1)
    const fac = idx.reduce((a, b) => a * (b === pointLoc ? 1 : pointLoc - b), 1)
    
    return idx.reduce((a, b) => b === pointLoc ? a : multiplyPolys(a, [-b, 1]), [height * 1.0 / fac])
}

// Transpose an array of polynomial
const transpose = (m: polynomial[]): polynomial[] => {
    return zipLongest(0, ...m)
}

console.log(transpose([[1,2,3,4],[5,6,7,8]]))