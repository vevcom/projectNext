export type Matrix<T> = T[][]

/**
 * Utility function for checking if an array of a given type fulfills the a requirement matrix.
 * The given array must have at least one item for each array (row) in the matrix.
 * [[A, B], [C, D]] means the given array must have (either A or B) and (either C or D).
 *
 * @param given - An array of a given type.
 * @param required - The requirements matrix.
 * @returns - true if the given array fulfills the required matrix, false otherwise.
 */
export default function checkMatrix<T>(given: T[], required: Matrix<T>): boolean {
    return required.every((row) => row.some((p) => given.includes(p)))
}
