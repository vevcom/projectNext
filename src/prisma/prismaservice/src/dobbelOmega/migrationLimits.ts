/**
 * Limits for the migration process to test without going crazy
 * null means no limit
 */
export function getLimits() {
    const limitsOn = process.env.MIGRATION_WITH_LIMITS !== 'false'
    limitsOn ? console.log('Limimits on') : console.log('Limits off!!!!!!!!!!!!')
    return {
        ombul: limitsOn ? 5 : null,
        numberOffFullImageCollections: limitsOn ? 3 : null,
    }
}
