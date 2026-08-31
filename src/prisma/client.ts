import logger from '@/lib/logger'
import { PrismaClient } from '@/prisma-generated-pn-client'
import { getContext } from '@/services/serviceOperation'
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
        const context = getContext()
        if (e.query.includes('SELECT')) { // Sets select query to debug as it generates an unreasonable amount of logs
            logger.debug('Prisma', {
                type: 'Query',
                params: e.params,
                query: e.query,
                duration: e.duration,
                user: context?.session.user?.username,
                apiKey: context?.session.apiKeyId,
                bypassAuth: context?.bypassAuth
            })
        } else {
            logger.info('Prisma', {
                type: 'Query',
                params: e.params,
                query: e.query,
                duration: e.duration,
                user: context?.session.user?.username,
                apiKey: context?.session.apiKeyId,
                bypassAuth: context?.bypassAuth
            })
        }
    })

    prisma.$on('error', (e) => {
        const context = getContext()
        logger.error('Prisma', {
            type: 'Error',
            message: e.message,
            user: context?.session.user?.username,
            apiKey: context?.session.apiKeyId,
            bypassAuth: context?.bypassAuth
        })
    })

    prisma.$on('info', (e) => {
        const context = getContext()
        logger.info('Prisma', {
            type: 'Info',
            message: e.message,
            user: context?.session.user?.username,
            apiKey: context?.session.apiKeyId,
            bypassAuth: context?.bypassAuth
        })
    })

    prisma.$on('warn', (e) => {
        const context = getContext()
        logger.info('Prisma', {
            type: 'Warn',
            message: e.message,
            user: context?.session.user?.username,
            apiKey: context?.session.apiKeyId,
            bypassAuth: context?.bypassAuth
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
