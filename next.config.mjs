/** @type {import('next').NextConfig} */
import path from 'path'

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'src/styles')],
    },

    // fix error with react-pdf use of canvas
    webpack: (config) => {
        config.resolve.alias.canvas = false

        return config
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '1000mb',
        },
    },

    // The default directories which next will lint do not include tests
    eslint: {
        dirs: ['src', 'tests'],
    },
}


module.exports = nextConfig
