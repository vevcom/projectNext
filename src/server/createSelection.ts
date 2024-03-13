
/**
 * A function to create the select atr. in prisma from fields.
 * @param fieldsToExpose - The fields to expose in an array
 * @returns
 */
export function createSelection<const T extends string>(fieldsToExpose: T[]): { [K in T]: true } {
    const selection = fieldsToExpose.reduce((prev, field) => ({
        ...prev,
        [field]: true
    }), {} as { [K in T]: true })
    return selection
}
