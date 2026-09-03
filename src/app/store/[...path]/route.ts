import '@pn-server-only'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import { join, normalize, sep } from 'path'
import { Readable } from 'stream'

const STORE_ROOT = normalize(join(process.cwd(), 'store'))

const CONTENT_TYPES: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    avif: 'image/avif',
}

function contentTypeFor(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() ?? ''
    return CONTENT_TYPES[extension] ?? 'application/octet-stream'
}

type PropTypes = {
    params: Promise<{
        path: string[]
    }>
}

export async function GET(request: Request, { params }: PropTypes) {
    const { path: segments } = await params
    const filePath = normalize(join(STORE_ROOT, ...segments))

    // Guard against path traversal escaping the store root
    if (filePath !== STORE_ROOT && !filePath.startsWith(STORE_ROOT + sep)) {
        return new Response('Not found', { status: 404 })
    }

    let fileStat
    try {
        fileStat = await stat(filePath)
    } catch {
        return new Response('Not found', { status: 404 })
    }
    if (!fileStat.isFile()) {
        return new Response('Not found', { status: 404 })
    }

    const contentType = contentTypeFor(filePath)
    const commonHeaders = {
        'Accept-Ranges': 'bytes',
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
    }

    const range = request.headers.get('range')
    const rangeMatch = range ? /bytes=(\d*)-(\d*)/.exec(range) : null
    if (rangeMatch) {
        const start = rangeMatch[1] ? parseInt(rangeMatch[1], 10) : 0
        const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : fileStat.size - 1
        const stream = createReadStream(filePath, { start, end })
        return new Response(Readable.toWeb(stream) as ReadableStream, {
            status: 206,
            headers: {
                ...commonHeaders,
                'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
                'Content-Length': String(end - start + 1),
            },
        })
    }

    const stream = createReadStream(filePath)
    return new Response(Readable.toWeb(stream) as ReadableStream, {
        status: 200,
        headers: {
            ...commonHeaders,
            'Content-Length': String(fileStat.size),
        },
    })
}
