import type { ImageResolution } from './resolutionForWidth'
import type { ExpandedImage } from '@/services/images/subservice/types'

/**
 * Resolves what to actually put in an img src for a given resolution. The resized variants are
 * produced in the background after upload, so until processing finishes anything but ORIGINAL
 * falls back to the inline blur placeholder.
 */
export function imageSourceForResolution(image: ExpandedImage, resolution: ImageResolution): string {
    if (resolution === 'ORIGINAL') return `/store/images/${image.fsLocationOriginal}`
    if (!image.processedFiles) return image.placeholderDataUrl
    switch (resolution) {
        case 'TINY':
            return `/store/images/${image.processedFiles.fsLocationTinySize}`
        case 'SMALL':
            return `/store/images/${image.processedFiles.fsLocationSmallSize}`
        case 'MEDIUM':
            return `/store/images/${image.processedFiles.fsLocationMediumSize}`
        case 'LARGE':
            return `/store/images/${image.processedFiles.fsLocationLargeSize}`
        default:
            // should never happen.
            return `/store/images/${image.fsLocationOriginal}`
    }
}
