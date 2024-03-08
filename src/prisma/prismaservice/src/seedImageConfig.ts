import type { SpecialImage, SpecialCollection } from '@/generated/pn'

type ImageSeedConfig = {
    name: string,
    alt: string,
    fsLocation: string, //location in standard_store/images
    collection: string,
}

const collectionForSpecialImages = 'STANDARDIMAGES' as const;


type ImageSeedSpecialConfig = {
    [K in SpecialImage]: ImageSeedConfig & { collection: SpecialCollection };
}

/**
 * This is the configuration for the images that are to be seeded
 * that are not special
 */
const seedImageConfig : ImageSeedConfig[] = [
    {
        name: 'traktat',
        alt: 'En gammel traktat',
        fsLocation: 'traktat.jpg',
        collection: collectionForSpecialImages,
    }
]

/**
 * This is the configuration for the images that are to be seeded
 * that are special
 */
const seedSpecialImageConfig : ImageSeedSpecialConfig = {
    DEFAULT_IMAGE: {
        name: 'default_image',
        alt: 'standard bilde (ikke funnet)',
        fsLocation: 'default_image.jpeg',
        collection: collectionForSpecialImages,
    },
    LENS_CAMERA: {
        name: 'lens_camera',
        alt: 'Et kamera med en linse',
        fsLocation: 'lens_camera.jpeg',
        collection: collectionForSpecialImages,
    },
}
