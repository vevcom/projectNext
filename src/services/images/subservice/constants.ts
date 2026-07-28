import type { Prisma } from '@/prisma-generated-pn-types'

export const maxImageFileSizeMb = 100

export const maxImageFileSizeBytes = maxImageFileSizeMb * 1024 * 1024

export const maxImageCountInOneBatch = 10

export const imageSizes = {
    placeholder: 16,
    tiny: 90,
    small: 180,
    medium: 360,
    large: 720,
} as const

export const imageProcessing = {
    maxAttempts: 3,
    pollIntervalMs: 2000,
    /**
     * How long a worker can take to process an image before its claim is considered stale and
     * another worker can pick it up. This is a safety valve for when a worker dies mid-processing.
     */
    staleClaimMinutes: 2,
} as const

export const avifConvertionOptions = {
    quality: 50,
    lossless: false,
    speed: 8, // default is 5
    chromaSubsampling: '4:2:0',
} as const

export const allowedExtensions = ['png', 'jpg', 'jpeg', 'heic', 'avif', 'webp'] as const

export const expandedImageIncluder = {
    processedFiles: true,
} satisfies Prisma.ImageInclude

export const expandedImageCollectionIncluder = {
    coverImage: { include: expandedImageIncluder },
    images: { take: 1, include: expandedImageIncluder },
    _count: { select: { images: true } },
} satisfies Prisma.ImageCollectionInclude
