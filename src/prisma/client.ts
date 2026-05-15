import logger from '@/lib/logger'
import { PrismaClient } from '@/prisma-generated-pn-client'
import { PrismaPg } from '@prisma/adapter-pg'

// To prevent hot reloading from creating new instances of PrismaClient it is stored in the global object.
// Read more about it in the section 'Prevent hot reloading from creating new instances of PrismaClient' here:
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections

function newPrisma() {
    const prisma = new PrismaClient({
        log: [
            {
                emit: 'event',
                level: 'query',
            },
            {
                emit: 'event',
                level: 'error',
            },
            {
                emit: 'event',
                level: 'info',
            },
            {
                emit: 'event',
                level: 'warn',
            },
        ],
        adapter: new PrismaPg(
            { connectionString: process.env.DB_URI },
            { schema: process.env.DB_SCHEMA },
        )
    })

    prisma.$on('query', (e) => {
        if (e.query.includes('SELECT')) { // Sets select query to debug as it generates an unreasonable amount of logs
            logger.log({
                level: 'debug',
                message:
                    `${e.timestamp} 
            Type: Query 
            Params: ${e.params} 
            Query: ${e.query} 
            Duration: ${e.duration} 
            Target: ${e.target}
            `,
            })
        } else {
            logger.log({
                level: 'info',
                message:
                    `${e.timestamp} 
            Type: Query 
            Params: ${e.params} 
            Query: ${e.query} 
            Duration: ${e.duration} 
            Target: ${e.target}
            `,
            })
        }
    })

    prisma.$on('error', (e) => {
        logger.log({
            level: 'error',
            message:
                `${e.timestamp} 
            Type: Error 
            Message: ${e.message} 
            Target: ${e.target}
            `,
        })
    })

    prisma.$on('info', (e) => {
        logger.log({
            level: 'info',
            message:
                `${e.timestamp} 
            Type: Info 
            Message: ${e.message} 
            Target: ${e.target}
            `,
        })
    })

    prisma.$on('warn', (e) => {
        logger.log({
            level: 'warn',
            message:
                `${e.timestamp} 
            Type: Info 
            Message: ${e.message} 
            Target: ${e.target}
            `,
        })
    })

    return prisma
}

// This is how the Prisma docs recommend doing it
const globalForPrisma = global as unknown as {
    prisma: ReturnType<typeof newPrisma>
}

export const prisma = globalForPrisma.prisma || newPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
