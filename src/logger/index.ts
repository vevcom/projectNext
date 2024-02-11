import winston from 'winston'
import 'winston-daily-rotate-file'

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
            dirname: process.env.LOG_DIRECTORY,
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: process.env.LOG_MAX_FILES,
        })
    ]
})

export default logger
