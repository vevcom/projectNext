import '@pn-server-only'

/**
 * PEM keys are stored in env vars with literal `\n` sequences instead of real
 * newlines, since most platform env-var UIs (Dokploy, Coolify, ...) don't
 * reliably preserve embedded newlines within a single value. This restores
 * them. Safe to call on a value that already has real newlines - there are
 * no literal `\n` sequences left to replace, so it's a no-op.
 */
export function readPemEnv(value: string): string {
    return value.replace(/\\n/g, '\n')
}
