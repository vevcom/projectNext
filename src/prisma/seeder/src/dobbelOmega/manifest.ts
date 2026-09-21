import winston from 'winston'

/**
 * Logger for the manifest the dobbelOmega migration
 */
const manifest = winston.createLogger({
    level: 'silly',
})

manifest.add(new winston.transports.Console())

manifest.add(new winston.transports.File({
    filename: 'manifest.log',
    dirname: 'dobbelOmegaManifest',
}))

export default manifest
