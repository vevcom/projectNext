import '@pn-server-only'
import { createReadStream, existsSync, statSync } from 'fs'
import { extname, resolve, sep } from 'path'
import { Readable } from 'stream'

// Mirrors nginx's `location /store/ { alias /usr/store/; }` (see
// containers/nginx/nginx.internal.conf) so the store volume can be served
// directly by Next.js when there's no nginx in front - e.g. a standalone
// Dokploy "Application" deploy or a preview deployment, which only run a
// single container and can't share nginx's mounted store volume.
const STORE_ROOT = resolve(process.cwd(), 'store')

const MIME_TYPES: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path: segments } = await params
    const filePath = resolve(STORE_ROOT, ...segments)

    // Reject anything that escapes STORE_ROOT (e.g. `..` segments).
    if (filePath !== STORE_ROOT && !filePath.startsWith(STORE_ROOT + sep)) {
        return new Response('Not found', { status: 404 })
    }

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        return new Response('Not found', { status: 404 })
    }

    const contentType = MIME_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream'
    const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream

    return new Response(stream, {
        headers: {
            'Content-Type': contentType,
        },
    })
}
