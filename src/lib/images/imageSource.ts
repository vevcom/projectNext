import type { ImageResolution } from './resolutionForWidth'
import type { ExpandedImage } from '@/services/images/subservice/types'

/**
 * Resolves what to actually put in an img src for a given resolution. The resized variants are
 * produced in the background after upload, so until processing finishes anything but ORIGINAL
 * falls back to the inline blur placeholder.
 *
 * Svgs have neither: a vector is the right file at every resolution, and it is available the moment
 * it is uploaded, so it is served as-is regardless of what was asked for.
 */
export function imageSourceForResolution(image: ExpandedImage, resolution: ImageResolution): string {
    if (image.type === 'SVG') return `/store/images/${image.fsLocationOriginal}`
    if (resolution === 'ORIGINAL') return `/store/images/${image.fsLocationOriginal}`
    if (!image.processedFiles) return image.placeholderDataUrl ?? `/store/images/${image.fsLocationOriginal}`
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
