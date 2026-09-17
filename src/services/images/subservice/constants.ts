import type { StorableExtension } from '@/lib/store/fileExtensions'
import type { Prisma } from '@/prisma-generated-pn-types'

type StorableExtensions = readonly StorableExtension[]

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
     * another worker can pick it up. This is a safety valve for when a worker dies mid-processing,
     * and - since a failed attempt keeps its claim - it is also the delay between attempts.
     */
    staleClaimMinutes: 2,
} as const

export const avifConvertionOptions = {
    quality: 50,
    lossless: false,
    speed: 8, // default is 5
    chromaSubsampling: '4:2:0',
} as const

/**
 * Formats that go through the background resize pipeline. `jpg` is absent on purpose - the store
 * names every jpeg `jpeg`, so `jpg` can never come back out of it.
 */
export const rasterExtensions = ['png', 'jpeg', 'heic', 'avif', 'webp'] as const satisfies StorableExtensions

export const svgExtensions = ['svg'] as const satisfies StorableExtensions

/**
 * Everything the image system can store. Individual implementations of th image system
 * accept a subset of this.
 */
export const allowedExtensions = [...rasterExtensions, ...svgExtensions] as const

export type ImageExtension = typeof allowedExtensions[number]

export const expandedImageIncluder = {
    processedFiles: true,
} satisfies Prisma.ImageInclude

export const expandedImageCollectionIncluder = {
    coverImage: { include: expandedImageIncluder },
    images: {
        take: 1,
        orderBy: { createdAt: 'asc' },
        include: expandedImageIncluder,
    },
    _count: { select: { images: true } },
} satisfies Prisma.ImageCollectionInclude
