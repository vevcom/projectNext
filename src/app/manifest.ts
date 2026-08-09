import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Sct. Omega Broderskab',
        short_name: 'Sct. Omega',
        description: 'Hjemmesiden for linjeforeningen Sanctus Omega Broderskab ved NTNU.',
        start_url: '/',
        display: 'standalone',
        background_color: '#131318',
        theme_color: '#037FFC',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}
