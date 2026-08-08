import '@pn-server-only'

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
    return Buffer.from(value, 'base64').toString('utf-8')
}
