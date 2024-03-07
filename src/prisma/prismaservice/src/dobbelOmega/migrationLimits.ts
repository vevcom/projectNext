/**
 * Returns Limits for the migration process to test without going crazy
 * null means no limit and happens if the env variable MIGRATION_WITH_LIMITS is set to "false"
 */
export function getLimits() {
    const limitsOn = process.env.MIGRATION_WITH_LIMITS !== 'false'
    console.log(limitsOn ? 'Limits on' : '!!!!Limits off!!!!')
    return {
        ombul: limitsOn ? 5 : null,
        numberOffFullImageCollections: limitsOn ? 3 : null,
        omegaquotes: limitsOn ? 500 : null,
    }
}

export type Limits = ReturnType<typeof getLimits>
