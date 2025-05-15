/**
 * @returns Limits for the migration process to test without going crazy
 * null means no limit and happens if the env variable MIGRATION_WITH_LIMITS is set to "false"
 */
export function getLimits() {
    const limits = {
        ombul: 5,
        numberOffFullImageCollections: 0,
        omegaquotes: null,
        articles: 300,
        mailaliases: 0,
        events: 100,
        users: 100,
    }
    const nullObj: { [key in keyof typeof limits]: null } = {
        ombul: null,
        numberOffFullImageCollections: null,
        omegaquotes: null,
        articles: null,
        mailaliases: null,
        events: null,
        users: null,
    }

    const limitsOn = process.env.MIGRATION_WITH_LIMITS !== 'false'
    console.log(limitsOn ? 'Limits on' : '!!!!Limits off!!!!')
    if (limitsOn) console.log('Limits:', limits)
    return limitsOn ? limits : nullObj
}

export type Limits = ReturnType<typeof getLimits>
