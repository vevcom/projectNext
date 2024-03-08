import type { SpecialImage, SpecialCollection } from '@/generated/pn'

type ImageSeedConfigBase = {
    name: string,
    alt: string,
    fsLocation: string, //location in standard_store/images
    collection: string,
}

const collectionForSpecialImages = 'STANDARDIMAGES' as const;

type ImageSeedConfig = ImageSeedConfigBase[]

type ImageSeedSpecialConfig = {
    [T in SpecialImage]: ImageSeedConfigBase & { collection: SpecialCollection };
}

/**
 * This is the configuration for the images that are to be seeded
 * that are not special
 */
export const seedImageConfig : ImageSeedConfig = [
    {
        name: 'trekant',
        alt: 'En gammel traktat',
        fsLocation: 'traktat.jpg',
        collection: collectionForSpecialImages,
    }
]

/**
 * This is the configuration for the images that are to be seeded
 * that are special
 */
export const seedSpecialImageConfig : ImageSeedSpecialConfig = {
    DEFAULT_IMAGE: {
        name: 'default_image',
        alt: 'standard bilde (ikke funnet)',
        fsLocation: 'default_image.jpeg',
        collection: collectionForSpecialImages,
    },
    KAPPEMANN: {
        name: 'kappemann',
        alt: 'En kappemann',
        fsLocation: 'kappemann.jpeg',
        collection: collectionForSpecialImages,
    },
    KONGSBERG: {
        name: 'kongsberg',
        alt: 'Kongsberg',
        fsLocation: 'kongsberg.png',
        collection: collectionForSpecialImages,
    },
    NORDIC: {
        name: 'nordic',
        alt: 'Nordic',
        fsLocation: 'nordic.png',
        collection: collectionForSpecialImages,
    },
    LENS_CAMERA: {
        name: 'lens_camera',
        alt: 'Et kamera med en linse',
        fsLocation: 'lens_camera.jpeg',
        collection: collectionForSpecialImages,
    },
    LOGO_SIMPLE: {
        name: 'logo_simple',
        alt: 'Logo',
        fsLocation: 'logo_simple.png',
        collection: collectionForSpecialImages,
    },
    LOGO_WHITE: {
        name: 'logo_white',
        alt: 'Logo',
        fsLocation: 'logo_white.png',
        collection: collectionForSpecialImages,
    },
    LOGO_WHITE_TEXT: {
        name: 'logo_white_text',
        alt: 'Logo',
        fsLocation: 'omega_logo_white.png',
        collection: collectionForSpecialImages,
    },
    MAKISK_HATT: {
        name: 'makisk_hatt',
        alt: 'Makisk hatt',
        fsLocation: 'makisk_hatt.png',
        collection: collectionForSpecialImages,
    },
    OHMA: {
        name: 'ohma',
        alt: 'Ohma',
        fsLocation: 'ohma.jpeg',
        collection: collectionForSpecialImages,
    },
    OMEGA_MAI: {
        name: 'omega_mai',
        alt: 'Omega mai',
        fsLocation: 'Omegamai.jpeg',
        collection: collectionForSpecialImages,
    },
    OV: {
        name: 'ov',
        alt: 'OV',
        fsLocation: 'ov.png',
        collection: collectionForSpecialImages,
    },
    PWA: {
        name: 'pwa',
        alt: 'PWA',
        fsLocation: 'pwa.png',
        collection: collectionForSpecialImages,
    },
}
