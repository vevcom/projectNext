import type { PrismaClient as PrismaClientPn } from '@prisma/client'
import type { PrismaClient as PrismaClientVeven } from '@/prisma-dobbel-omega/client'
import type { Limits } from './migrationLimits'


export default async function migrateMailAliases(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    limits: Limits,
) {
    if (limits.mailaliases === 0) return
    const aliases = await vevenPrisma.mailAliases.findMany({
        take: limits.mailaliases ?? undefined,
        include: {
            ExtraAliasMembers: true,
        }
    })

    await pnPrisma.mailAlias.deleteMany()
    await pnPrisma.mailingList.deleteMany()
    await pnPrisma.mailAddressExternal.deleteMany()

    await pnPrisma.mailAlias.createMany({
        data: aliases.map(a => ({
            address: a.address,
            description: a.name,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
        }))
    })


    await Promise.all(aliases.map(a => pnPrisma.mailingList.create({
        data: {
            name: a.name,
            id: a.id,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
            mailAliases: {
                create: {
                    mailAlias: {
                        connect: {
                            address: a.address,
                        }
                    }
                }
            }
        }
    })))

    const omegaFilter = (a: typeof externalAdrs[number]) => a.address.trim().endsWith('@omega.ntnu.no')
    const studNtnuFilter = (a: typeof externalAdrs[number]) => a.address.trim().endsWith('@stud.ntnu.no')

    const externalAdrs = aliases.map(a => a.ExtraAliasMembers.map(e => ({
        address: e.address,
        id: a.id,
    }))).flat()

    const alredyAdded = new Set<string>()

    for (let i = 0; i < externalAdrs.length; i++) {
        const a = externalAdrs[i]
        if (omegaFilter(a) || studNtnuFilter(a)) {
            continue
        }

        if (!alredyAdded.has(a.address)) {
            await pnPrisma.mailAddressExternal.create({
                data: {
                    address: a.address,
                    mailingLists: {
                        create: {
                            mailingList: {
                                connect: {
                                    id: a.id,
                                }
                            }
                        }
                    }
                }
            })
            alredyAdded.add(a.address)
        } else {
            await pnPrisma.mailingListMailAddressExternal.create({
                data: {
                    mailingList: {
                        connect: {
                            id: a.id,
                        }
                    },
                    mailAddressExternal: {
                        connect: {
                            address: a.address,
                        }
                    }
                }
            })
        }
    }

    const omegaForward: {address: string, id: number}[] = []

    const searchRecusive = (address: string, alias: typeof aliases[number]) => {
        omegaForward.push({
            address,
            id: alias.id,
        })

        alias.ExtraAliasMembers.forEach(a => {
            const sAlias = aliases.find(b => b.address === a.address)
            if (sAlias) {
                searchRecusive(address, sAlias)
            }
        })
    }

    externalAdrs.filter(omegaFilter).forEach(a => {
        const alias = aliases.find(b => b.address === a.address)
        if (alias) {
            searchRecusive(a.address, alias)
        }
    })

    console.log(omegaForward)
    let errors = 0

    for (let i = 0; i < omegaForward.length; i++) {
        const a = omegaForward[i]

        try {
            await pnPrisma.mailAliasMailingList.create({
                data: {
                    mailAlias: {
                        connect: {
                            address: a.address,
                        },
                    },
                    mailingList: {
                        connect: {
                            id: a.id,
                        }
                    }
                }
            })
        } catch (e) {
            console.error(e)
            errors++
        }
    }
    console.log('Errors:', errors)
}
