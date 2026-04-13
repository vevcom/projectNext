
type StandardLicenseConfig = {
    name: string
    link: string
}

/**
 * These are the licenses that need to exist for the project to be seeded.
 * It is both needed for `standardimages` and for the seeding of dynamic images on startup
 */
export const standardLicensesConfig = [
    {
        name: 'CC BY-SA 4.0',
        link: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    {
        name: 'Paxels',
        link: 'https://www.pexels.com/license/',
    },
] as const satisfies StandardLicenseConfig[]

export type StandardLicenseName = typeof standardLicensesConfig[number]['name']
