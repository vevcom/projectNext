import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // Trace the modules the server actually imports into .next/standalone, so the
    // production image ships those instead of the whole 1.3 GB node_modules.
    output: 'standalone',
    sassOptions: {
        includePaths: [path.join(__dirname, 'src/styles')],
    },
    webpack: (config) => {
        // fix error with react-pdf use of canvas -if using webpack
        config.resolve.alias.canvas = false
        return config
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '1000mb',
        },
    },
    turbopack: {},
}

export default nextConfig
