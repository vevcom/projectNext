import { notFound } from 'next/navigation'

/**
 * Encodes a name and ID into a URI-friendly format for Veven links
 * Combines the ID with the name, replacing spaces with hyphens
 * WARNING: the encoding will ignore the name, and only do lookups by id.
 * @param name The name to encode in the URI
 * @param id The numeric identifier to prepend
 * @returns The encoded string in the format "id-hyphenated-name"
 */
export function formatVevnUri(name: string, id: number): string {
    return `${encodeURIComponent(name).replaceAll('%20', '-').toLowerCase()}-${id}`
}

/**
 * Decodes a Veven URI and extracts the numeric ID
 * Takes a URI string in the format "id-name" and returns just the ID portion
 * WARNING: This will ignore the name, and only return the id
 * @param uri The URI string to decode
 * @returns The numeric ID extracted from the URI
 */
export function decodeVevenUri(uri: string): number {
    const urlSplitted = uri.split('-')
    return parseInt(urlSplitted[urlSplitted.length - 1], 10)
}

export function decodeVevenUriHandleError(uri: string) {
    const result = decodeVevenUri(uri)
    if (isNaN(result)) {
        notFound()
    }
    return result
}
