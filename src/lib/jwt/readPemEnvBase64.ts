import '@pn-server-only'
import { ServerError } from '@/services/error'

/**
 * PEM keys are stored in env vars as base64 rather than raw multi-line text.
 * Some platform env-var UIs (Dokploy included) don't reliably preserve a
 * literal `\n`-escaped value either - they auto-resolve escape sequences
 * back into real newlines when saving, which then breaks the .env file's
 * line-based format the same way an unescaped multi-line PEM does. Base64
 * has no newlines, backslashes, or quotes left for any UI to "helpfully"
 * reinterpret.
 */
export function readPemEnvBase64(value: string): string {
    const pem = Buffer.from(value, 'base64').toString('utf-8')

    // Buffer.from doesn't throw on input that isn't base64 - it skips whatever it
    // can't decode - so a raw PEM carried over from the old env format decodes to
    // garbage and only fails deep inside jsonwebtoken. verifyJWT reports that as
    // JWT INVALID, which makes a deploy misconfiguration look like a bad token.
    // Fail here instead, as the configuration error it actually is.
    if (!pem.startsWith('-----BEGIN ')) {
        throw new ServerError(
            'INVALID CONFIGURATION',
            'A PEM env value must be the base64 encoding of a PEM key, not the PEM itself'
        )
    }

    return pem
}
