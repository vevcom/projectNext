import type { SpecialImage, SpecialCollection } from '@/generated/pn'

type ImageSeedConfigBase = {
    name: string,
    alt: string,
    fsLocation: string, //location in standard_store/images
    collection: string,
}

const defaultCollection = 'STANDARDIMAGES' satisfies SpecialCollection

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
    },
    {
        name: 'kappemann',
        alt: 'En kappemann',
        fsLocation: 'kappemann.jpeg',
        collection: defaultCollection,
    },
    {
        name: 'kongsberg',
        alt: 'Kongsberg',
        fsLocation: 'kongsberg.png',
        collection: defaultCollection,
    },
    {
        name: 'nordic',
        alt: 'Nordic',
        fsLocation: 'nordic.png',
        collection: defaultCollection,
    },
    {
        name: 'ohma',
        alt: 'Ohma',
        fsLocation: 'ohma.jpeg',
        collection: defaultCollection,
    },
    {
        name: 'omega_mai',
        alt: 'Omega mai',
        fsLocation: 'Omegamai.jpeg',
        collection: defaultCollection,
    },
    {
        name: 'ov',
        alt: 'OV',
        fsLocation: 'ov.jpeg',
        collection: defaultCollection,
    },
    {
        name: 'pwa',
        alt: 'PWA',
        fsLocation: 'pwa.png',
        collection: defaultCollection,
    },
    {
        name: 'harambe',
        alt: 'Harambe',
        fsLocation: 'harambe.jpg',
        collection: 'PROFILEIMAGES'
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
    },
    DEFAULT_IMAGE_COLLECTION_COVER: {
        name: 'lens_camera',
        alt: 'Et kamera med en linse',
        fsLocation: 'lens_camera.jpeg',
        collection: defaultCollection,
    },
    DEFAULT_PROFILE_IMAGE: {
        name: 'default_profile_image',
        alt: 'standard profilbilde',
        fsLocation: 'default_profile_image.png',
        collection: 'PROFILEIMAGES',
    },
    DAFAULT_COMMITTEE_LOGO: {
        name: 'default_committee_logo',
        alt: 'komité logo',
        fsLocation: 'logo_simple.png',
        collection: 'COMMITTEELOGOS',
    },
    LOGO_SIMPLE: {
        name: 'logo_simple',
        alt: 'Logo',
        fsLocation: 'logo_simple.png',
        collection: defaultCollection,
    },
    LOGO_WHITE: {
        name: 'logo_white',
        alt: 'Logo',
        fsLocation: 'logo_white.png',
        collection: defaultCollection,
    },
    LOGO_WHITE_TEXT: {
        name: 'logo_white_text',
        alt: 'Logo',
        fsLocation: 'omega_logo_white.png',
        collection: defaultCollection,
    },
    MAGISK_HATT: {
        name: 'magisk_hatt',
        alt: 'Magisk hatt',
        fsLocation: 'magisk_hatt.png',
        collection: defaultCollection,
    },
    HOVEDBYGGNINGEN: {
        name: 'hovedbygningen',
        alt: 'Hovedbygningen',
        fsLocation: 'hovedbygningen.webp',
        collection: defaultCollection,
    },
    R1: {
        name: 'R1 NTNU',
        alt: 'R1 på NTNU',
        fsLocation: 'R1NTNU.jpeg',
        collection: defaultCollection,
    },
    ENGINEER: {
        name: 'engineer',
        alt: 'Engineer',
        fsLocation: 'engineer.jpeg',
        collection: defaultCollection,
    },
    SKYSCRAPER: {
        name: 'skyscraper',
        alt: 'Skyscraper',
        fsLocation: 'skyscraper.jpeg',
        collection: defaultCollection,
    },
    FAIR: {
        name: 'fair',
        alt: 'Fair',
        fsLocation: 'fair.webp',
        collection: defaultCollection,
    },
} as const
