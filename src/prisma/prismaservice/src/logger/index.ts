import winston from 'winston'

const logger = winston.createLogger({
    level: 'silly',
})

logger.add(new winston.transports.Console())

logger.add(new winston.transports.File({
    filename: 'manifest.log',
    dirname: 'dobbelOmegaManifest',
}))

export default logger