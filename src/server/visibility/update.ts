import 'server-only'
import { VisibilityCollapsed } from './Types';
import { prismaCall } from '../prismaCall';
import prisma from '@/prisma';

export async function updateVisibility(id: number, data: VisibilityCollapsed) : Promise<void> {
    //TODO chack that the admin is a subset of the regular

    await prismaCall(() => prisma.$transaction([
        //first remove all the old conditions. This will also remove all join tables to groups on cascade.
        prisma.visibilityRequiremenet.deleteMany({
            where: {
                visibilityId: id
            }
        }),
        //Then create many new requirements
        data.type === 'SPECIAL' ? prisma.visibility.update({
            where: {
                id: id
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
                id: id
            },
            data: {
                type: 'REGULAR',
                regularLevel: {
                    create: {
                        requiremenets: {
                            create: data.regular.map(row => ({
                                visibilityRequirementGroups: {
                                    create: row.map(groupId => ({
                                        groupId: groupId
                                    }))
                                }
                            }))
                        }
                    }
                },
                adminLevel: {
                    create: {
                        requiremenets: {
                            create: data.admin.map(row => ({
                                visibilityRequirementGroups: {
                                    create: row.map(groupId => ({
                                        groupId: groupId
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