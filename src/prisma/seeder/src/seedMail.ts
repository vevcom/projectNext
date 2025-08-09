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
        },
        {
            name: 'HeutteCom',
            aliases: [
                'heuttecommiteen',
                'heuttebooking',
            ]
        }
    ]

    const allAliases = mailingLists.map(mailingList => mailingList.aliases).flat().concat(otherAliases)
    const aliasSet = new Set(allAliases)

    const aliasIdMap = new Map<string, number>()

    await Promise.all(Array.from(aliasSet).map(async (alias) => {
        const results = await prisma.mailAlias.create({
            data: {
                address: alias + DOMAIN
            }
        })

        aliasIdMap.set(alias, results.id)
    }))

    await Promise.all(mailingLists.map(mailingList => prisma.mailingList.create({
        data: {
            name: mailingList.name,
            mailAliases: {
                createMany: {
                    data: mailingList.aliases.map(alias => ({
                        mailAliasId: aliasIdMap.get(alias),
                    })).filter(aliasEntry => aliasEntry.mailAliasId !== undefined) as {
                        mailAliasId: number
                    }[],
                }
            }
        }
    })))
}
