import type { StandardLicenseName } from '@/services/licenses/constants'

export type ImageSeedConfigBase = {
    name: string,
    alt: string,
    fsLocation: string,
    credit: string | null,
    license: StandardLicenseName | null,
}

/**
 * This is the configuration for the images that are to be seeded
 * that are not special
 */
export const seedImageConfig: ImageSeedConfig = [
    {
        name: 'traktat',
        alt: 'En gammel traktat',
        fsLocation: 'treaty.jpeg',
        credit: 'Skylar Kang',
        license: 'Paxels',
    },
    {
        name: 'kappemann',
        alt: 'En kappemann',
        fsLocation: 'kappemann.jpeg',
        credit: null,
        license: null,
    },
    {
        name: 'kongsberg',
        alt: 'Kongsberg',
        fsLocation: 'kongsberg.png',
        credit: null,
        license: null,
    },
    {
        name: 'nordic',
        alt: 'Nordic',
        fsLocation: 'nordic.png',
        credit: null,
        license: null,
    },
    {
        name: 'ohma',
        alt: 'Ohma',
        fsLocation: 'ohma.jpeg',
        credit: null,
        license: null,
    },
    {
        name: 'omega_mai',
        alt: 'Omega mai',
        fsLocation: 'Omegamai.jpeg',
        credit: null,
        license: null,
    },
    {
        name: 'ov',
        alt: 'OV',
        fsLocation: 'ov.jpeg',
        credit: null,
        license: null,
    },
    {
        name: 'pwa',
        alt: 'PWA',
        fsLocation: 'pwa.png',
        credit: null,
        license: null,
    },
    {
        name: 'harambe',
        alt: 'Harambe',
        fsLocation: 'harambe.jpg',
        collection: 'PROFILEIMAGES',
        credit: null,
        license: null,
    },
    {
        name: 'kappemann_bronse',
        alt: 'Kappemann bronse',
        fsLocation: 'kappemann_bronse.png',
        collection: 'FLAIRIMAGES',
        credit: null,
        license: null,
    },
    {
        name: 'kappemann_solv',
        alt: 'Kappemann solv',
        fsLocation: 'kappemann_solv.png',
        collection: 'FLAIRIMAGES',
        credit: null,
        license: null,
    },
    {
        name: 'kappemann_gull',
        alt: 'Kappemann gull',
        fsLocation: 'kappemann_gull.png',
        collection: 'FLAIRIMAGES',
        credit: null,
        license: null,
    },
    {
        name: 'kappemann_diamant',
        alt: 'Kappemann diamant',
        fsLocation: 'kappemann_diamant.png',
        collection: 'FLAIRIMAGES',
        credit: null,
        license: null,
    },
    {
        name: 'kappemann_paske',
        alt: 'Kappemann paske',
        fsLocation: 'kappemann_paske.png',
        collection: 'FLAIRIMAGES',
        credit: null,
        license: null,
    },
]
