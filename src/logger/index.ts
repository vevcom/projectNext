import winston from 'winston'
import 'winston-daily-rotate-file'

console.log(`Logger created with parameter ${process.env.LOG_LEVEL}, ${process.env.LOG_MAX_FILES}`)

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
            dirname: './logs',
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: process.env.LOG_MAX_FILES,
        })
    ]
})

export default logger
