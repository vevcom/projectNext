import type { Prisma } from '@/prisma-generated-pn-types'

export const maxImageFileSizeMb = 100

export const maxImageFileSizeBytes = maxImageFileSizeMb * 1024 * 1024

export const maxImageCountInOneBatch = 10

export const imageSizes = {
    small: 180,
    medium: 360,
    large: 720,
} as const

export const avifConvertionOptions = {
    quality: 50,
    lossless: false,
    speed: 8, // default is 5
    chromaSubsampling: '4:2:0',
} as const

export const allowedExtensions = ['png', 'jpg', 'jpeg', 'heic', 'avif', 'webp'] as const

export const expandedImageCollectionIncluder = {
    coverImage: true,
    images: {
        take: 1,
        orderBy: { createdAt: 'asc' }
    },
    _count: { select: { images: true } },
} satisfies Prisma.ImageCollectionInclude
