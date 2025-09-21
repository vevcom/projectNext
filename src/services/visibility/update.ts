import '@pn-server-only'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { VisibilityLevelMatrices } from './Types'

export async function updateVisibility(id: number, data: VisibilityLevelMatrices): Promise<void> {
    //TODO chack that the admin is a subset of the regular

    await prismaCall(() => prisma.$transaction([
        //first remove all the old conditions. This will also remove all join tables to groups on cascade.
        prisma.visibilityRequirement.deleteMany({
            where: {
                visibilityId: id
            }
        }),
        //Then create many new requirements
        prisma.visibility.update({
            where: {
                id
            },
            data: {
                regularLevel: {
                    create: {
                        requirements: {
                            create: data.regular.map(row => ({
                                visibilityRequirementGroups: {
                                    create: row.map(groupId => ({
                                        groupId
                                    }))
                                }
                            }))
                        }
                    }
                },
                adminLevel: {
                    create: {
                        requirements: {
                            create: data.admin.map(row => ({
                                visibilityRequirementGroups: {
                                    create: row.map(groupId => ({
                                        groupId
                                    }))
                                }
                            }))
                        }
                    }
                }
            }
        })
    ]))
}

export async function updateVisibilityPublished(id: number, published: boolean): Promise<void> {
    await prismaCall(() => prisma.visibility.update({
        where: {
            id
        },
        data: {
            published
        }
    }))
}
