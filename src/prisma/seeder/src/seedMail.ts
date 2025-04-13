import type { PrismaClient } from '@prisma/client'


export default async function seedMail(prisma: PrismaClient) {
    const DOMAIN = '@omega.ntnu.no'

    const otherAliases = [
        'noreply',
    ]

    const mailingLists = [
        {
            name: 'Vevcom',
            aliases: [
                'vevcom',
                'stripe',
            ],
        },
        {
            name: 'Hovedstyret',
            aliases: [
                'hs'
            ],
        },
        {
            name: 'Ombul',
            aliases: [
                'ombul',
            ],
        },
        {
            name: 'Bleast',
            aliases: [
                'bleast',
            ]
        },
        {
            name: 'Contactor',
            aliases: [
                'contactor',
            ]
        }
    ]

    const allAliases = mailingLists.map(m => m.aliases).flat().concat(otherAliases)
    const aliasSet = new Set(allAliases)

    const aliasIdMap = new Map<string, number>()

    await Promise.all(Array.from(aliasSet).map(async (a) => {
        const results = await prisma.mailAlias.create({
            data: {
                address: a + DOMAIN
            }
        })

        aliasIdMap.set(a, results.id)
    }))

    await Promise.all(mailingLists.map(m => prisma.mailingList.create({
        data: {
            name: m.name,
            mailAliases: {
                createMany: {
                    data: m.aliases.map(a => ({
                        mailAliasId: aliasIdMap.get(a),
                    })).filter(a => a.mailAliasId !== undefined) as {
                        mailAliasId: number
                    }[],
                }
            }
        }
    })))
}
