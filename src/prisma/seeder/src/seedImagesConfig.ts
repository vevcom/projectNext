import type { SpecialImage, SpecialCollection } from '@prisma/client'

type LicenseSeed = {
    name: string,
    link: string,
}

export const seedLicenseConfig = [
    {
        name: 'CC BY-SA 4.0',
        link: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    {
        name: 'Paxels',
        link: 'https://www.pexels.com/license/',
    },
] as const satisfies LicenseSeed[]

type licenseName = typeof seedLicenseConfig[number]['name']

type ImageSeedConfigBase = {
    name: string,
    alt: string,
    fsLocation: string, //location in standard_store/images
    collection: string,
    credit: string | null,
    license: licenseName | null,
}

const defaultCollection = 'STANDARDIMAGES' as const satisfies SpecialCollection

type ImageSeedConfig = ImageSeedConfigBase[]

type ImageSeedSpecialConfig = {
    [T in SpecialImage]: ImageSeedConfigBase & { collection: SpecialCollection };
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
        collection: defaultCollection,
        credit: 'Skylar Kang',
        license: 'Paxels',
    },
    {
        name: 'kappemann',
        alt: 'En kappemann',
        fsLocation: 'kappemann.jpeg',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    {
        name: 'kongsberg',
        alt: 'Kongsberg',
        fsLocation: 'kongsberg.png',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    {
        name: 'nordic',
        alt: 'Nordic',
        fsLocation: 'nordic.png',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    {
        name: 'ohma',
        alt: 'Ohma',
        fsLocation: 'ohma.jpeg',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    {
        name: 'omega_mai',
        alt: 'Omega mai',
        fsLocation: 'Omegamai.jpeg',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    {
        name: 'ov',
        alt: 'OV',
        fsLocation: 'ov.jpeg',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    {
        name: 'pwa',
        alt: 'PWA',
        fsLocation: 'pwa.png',
        collection: defaultCollection,
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
    }
]

/**
 * This is the configuration for the images that are to be seeded
 * that are special
 */
export const seedSpecialImageConfig: ImageSeedSpecialConfig = {
    DEFAULT_IMAGE: {
        name: 'default_image',
        alt: 'standard bilde (ikke funnet)',
        fsLocation: 'default_image.jpeg',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    DEFAULT_IMAGE_COLLECTION_COVER: {
        name: 'lens_camera',
        alt: 'Et kamera med en linse',
        fsLocation: 'lens_camera.jpeg',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    DEFAULT_PROFILE_IMAGE: {
        name: 'default_profile_image',
        alt: 'standard profilbilde',
        fsLocation: 'default_profile_image.png',
        collection: 'PROFILEIMAGES',
        credit: null,
        license: null,
    },
    DAFAULT_COMMITTEE_LOGO: {
        name: 'default_committee_logo',
        alt: 'komité logo',
        fsLocation: 'logo_simple.png',
        collection: 'COMMITTEELOGOS',
        credit: null,
        license: null,
    },
    LOGO_SIMPLE: {
        name: 'logo_simple',
        alt: 'Logo',
        fsLocation: 'logo_simple.png',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    LOGO_WHITE: {
        name: 'logo_white',
        alt: 'Logo',
        fsLocation: 'logo_white.png',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    LOGO_WHITE_TEXT: {
        name: 'logo_white_text',
        alt: 'Logo',
        fsLocation: 'omega_logo_white.png',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    MAGISK_HATT: {
        name: 'magisk_hatt',
        alt: 'Magisk hatt',
        fsLocation: 'magisk_hatt.png',
        collection: defaultCollection,
        credit: null,
        license: null,
    },
    HOVEDBYGGNINGEN: {
        name: 'hovedbygningen',
        alt: 'Hovedbygningen',
        fsLocation: 'hovedbygget.jpeg',
        collection: defaultCollection,
        credit: 'Thomas Høstad/NTNU',
        license: 'CC BY-SA 4.0',
        // https://ntnu.fotoware.cloud/fotoweb/archives/
        // 5005-Blinkskudd/Folder%20112/Hovedbygget-03.jpg.info#c=%2Ffotoweb%2Farchives%2F5005-Blinkskudd%2F
    },
    BOOKS: {
        name: 'Books',
        alt: 'Bøker',
        fsLocation: 'books.jpeg',
        collection: defaultCollection,
        credit: 'Alexander Grey',
        license: 'Paxels',
    },
    MACHINE: {
        name: 'machine',
        alt: 'Maskin',
        fsLocation: 'machine.jpeg',
        collection: defaultCollection,
        credit: 'Børge Sandnes/NTNU',
        license: 'CC BY-SA 4.0',
        // https://ntnu.fotoware.cloud/fotoweb/archives/
        // 5005-Blinkskudd/Folder%20112/Manu-08.jpg.info#c=%2Ffotoweb%2Farchives%2F5005-Blinkskudd%2F
    },
    REALFAGSBYGGET: {
        name: 'Realfagsbygget',
        alt: 'Realfagsbygget',
        fsLocation: 'realfagsbygget.jpeg',
        collection: defaultCollection,
        credit: 'Per Henning/NTNU',
        license: 'CC BY-SA 4.0',
        // https://ntnu.fotoware.cloud/fotoweb/archives/
        // 5019-Campuser/Folder%20112/Realfagbygget-soloppgang-2015-2.jpg.info#c=%2Ffotoweb%2Farchives%2F5019-Campuser%2F
    },
    FAIR: {
        name: 'fair',
        alt: 'Fair',
        fsLocation: 'fair.jpeg',
        collection: defaultCollection,
        credit: null,
        license: null,
        // From contactor
    },
} as const
