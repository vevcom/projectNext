export type ImageSize = 'TINY' | 'SMALL' | 'MEDIUM' | 'LARGE'

export type ImageResolution = ImageSize | 'ORIGINAL'

const breakpoints = { tiny: 130, small: 250, medium: 500 } as const

/**
 * Picks the smallest stored resolution that still comfortably covers a display width, so the
 * resolution an image is served at is always a deterministic function of where it's rendered -
 * never a stored, user-editable choice.
 */
export function resolutionForWidth(width: number): ImageSize {
    if (width <= breakpoints.tiny) return 'TINY'
    if (width <= breakpoints.small) return 'SMALL'
    if (width <= breakpoints.medium) return 'MEDIUM'
    return 'LARGE'
}
