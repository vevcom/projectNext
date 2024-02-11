import winston from 'winston'
import 'winston-daily-rotate-file'

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
})

if(process.env.LOG_TO_CONSOLE === 'true') {
    logger.add(new winston.transports.Console())
}

if(process.env.LOG_TO_FILE === 'true') {
    logger.add(new winston.transports.DailyRotateFile({
        dirname: './logs',
        filename: '%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: process.env.LOG_MAX_FILES,
    }))
}

export default logger
