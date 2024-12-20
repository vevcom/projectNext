import type { SpecialImage, SpecialCollection } from '@/generated/pn'

type LisenceSeed = {
    name: string,
    link: string,
}

export const seedLisenceConfig = [
    {
        name: 'CC BY-SA 4.0',
        link: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
] as const satisfies LisenceSeed[]

type LisenceName = typeof seedLisenceConfig[number]['name']

type ImageSeedConfigBase = {
    name: string,
    alt: string,
    fsLocation: string, //location in standard_store/images
    collection: string,
    credit: string | null,
    lisence: LisenceName | null,
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
        fsLocation: 'traktat.jpg',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    {
        name: 'kappemann',
        alt: 'En kappemann',
        fsLocation: 'kappemann.jpeg',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    {
        name: 'kongsberg',
        alt: 'Kongsberg',
        fsLocation: 'kongsberg.png',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    {
        name: 'nordic',
        alt: 'Nordic',
        fsLocation: 'nordic.png',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    {
        name: 'ohma',
        alt: 'Ohma',
        fsLocation: 'ohma.jpeg',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    {
        name: 'omega_mai',
        alt: 'Omega mai',
        fsLocation: 'Omegamai.jpeg',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    {
        name: 'ov',
        alt: 'OV',
        fsLocation: 'ov.jpeg',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    {
        name: 'pwa',
        alt: 'PWA',
        fsLocation: 'pwa.png',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    {
        name: 'harambe',
        alt: 'Harambe',
        fsLocation: 'harambe.jpg',
        collection: 'PROFILEIMAGES',
        credit: null,
        lisence: null,
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
        lisence: null,
    },
    DEFAULT_IMAGE_COLLECTION_COVER: {
        name: 'lens_camera',
        alt: 'Et kamera med en linse',
        fsLocation: 'lens_camera.jpeg',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    DEFAULT_PROFILE_IMAGE: {
        name: 'default_profile_image',
        alt: 'standard profilbilde',
        fsLocation: 'default_profile_image.png',
        collection: 'PROFILEIMAGES',
        credit: null,
        lisence: null,
    },
    DAFAULT_COMMITTEE_LOGO: {
        name: 'default_committee_logo',
        alt: 'komité logo',
        fsLocation: 'logo_simple.png',
        collection: 'COMMITTEELOGOS',
        credit: null,
        lisence: null,
    },
    LOGO_SIMPLE: {
        name: 'logo_simple',
        alt: 'Logo',
        fsLocation: 'logo_simple.png',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    LOGO_WHITE: {
        name: 'logo_white',
        alt: 'Logo',
        fsLocation: 'logo_white.png',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    LOGO_WHITE_TEXT: {
        name: 'logo_white_text',
        alt: 'Logo',
        fsLocation: 'omega_logo_white.png',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    MAGISK_HATT: {
        name: 'magisk_hatt',
        alt: 'Magisk hatt',
        fsLocation: 'magisk_hatt.png',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    HOVEDBYGGNINGEN: {
        name: 'hovedbygningen',
        alt: 'Hovedbygningen',
        fsLocation: 'magisk_hatt.png',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    R1: {
        name: 'R1 NTNU',
        alt: 'R1 på NTNU',
        fsLocation: 'R1NTNU.jpeg',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    ENGINEER: {
        name: 'engineer',
        alt: 'Engineer',
        fsLocation: 'engineer.jpeg',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    SKYSCRAPER: {
        name: 'skyscraper',
        alt: 'Skyscraper',
        fsLocation: 'skyscraper.jpeg',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
    FAIR: {
        name: 'fair',
        alt: 'Fair',
        fsLocation: 'fair.webp',
        collection: defaultCollection,
        credit: null,
        lisence: null,
    },
} as const