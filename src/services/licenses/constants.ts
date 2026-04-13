
export const standardLicenseNames = [
    'CC BY-SA 4.0',
    'Paxels',
] as const

export type StandardLicenseName = typeof standardLicenseNames[number]

type StandardLicenseConfig = {
    name: StandardLicenseName
    link: string
}

/**
 * These are the licenses that need to exist for the project to be seeded.
 * It is both needed for `standardimages` and for the seeding of dynamic images on startup
 */
export const standardLicensesConfig = [
    {
        name: standardLicenseNames[0],
        link: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    {
        name: standardLicenseNames[1],
        link: 'https://www.pexels.com/license/',
    },
] as const satisfies StandardLicenseConfig[]

