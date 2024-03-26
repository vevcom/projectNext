import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { VisibilityCollapsed, VisibilityCollapsedWithouPurpose } from './Types'

export async function updateVisibility(id: number, data: VisibilityCollapsedWithouPurpose): Promise<void> {
    //TODO chack that the admin is a subset of the regular

    await prismaCall(() => prisma.$transaction([
        //first remove all the old conditions. This will also remove all join tables to groups on cascade.
        prisma.visibilityRequirement.deleteMany({
            where: {
                visibilityId: id
            }
        }),
        //Then create many new requirements
        data.type === 'SPECIAL' ? prisma.visibility.update({
            where: {
                id
            },
            data: {
                type: 'SPECIAL',
                regularLevel: {
                    update: {
                        permission: data.regular
                    }
                },
                adminLevel: {
                    update: {
                        permission: data.admin
                    }
                }
            }
        }) : prisma.visibility.update({
            where: {
                id
            },
            data: {
                type: 'REGULAR',
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
