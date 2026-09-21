//This file declears which extientions are allowed to be in
//the store system

const mimeTypesByExtension = {
    png: ['image/png'],
    jpeg: ['image/jpeg', 'image/jpg'],
    heic: ['image/heic'],
    avif: ['image/avif'],
    webp: ['image/webp'],
    svg: ['image/svg+xml', 'image/svg'],
    pdf: ['application/pdf'],
} as const satisfies Record<string, readonly [string, ...string[]]>

export type StorableExtension = keyof typeof mimeTypesByExtension

const canonicalExtensionByAlias = new Map<string, StorableExtension>([
    ['jpg', 'jpeg'],
])

const canonicalMimeTypeByExtension = new Map<string, string>(
    Object.entries(mimeTypesByExtension).map(([extension, mimeTypes]) => [extension, mimeTypes[0]])
)

/**
 * Which of `candidates` this mime type spells, or null if it spells none of them. The caller decides
 * what is acceptable purely by what it passes as candidates - a mime type this table has never heard
 * of and one that names a format the caller did not ask for are the same answer.
 */
export function extensionForMimeType<Extension extends StorableExtension>(
    mimeType: string,
    candidates: readonly Extension[],
): Extension | null {
    const normalized = mimeType.split(';')[0].trim().toLowerCase()
    return candidates.find(
        candidate => (mimeTypesByExtension[candidate] as readonly string[]).includes(normalized)
    ) ?? null
}

/**
 * The mime type to construct a File with, for a file read off disk by its extension, or null if no
 * known format is named that way. Used by the standard store and the omegaweb-basic migration, whose
 * Note that we are not simply doint image/${extension} because that would produce image/jpg for .jpg files,
 * and the store names every jpeg image .jpeg, so that would be wrong.
 * We need to get the canonical mime type for the extension, and the store will then use that to name the file correctly.
 */
export function mimeTypeForExtension(extension: string): string | null {
    const normalized = extension.trim().toLowerCase().replace(/^\./, '')
    return canonicalMimeTypeByExtension.get(
        canonicalExtensionByAlias.get(normalized) ?? normalized
    ) ?? null
}
