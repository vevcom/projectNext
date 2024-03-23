import 'server-only'
import { prismaCall } from '../prismaCall'
import prisma from '@/prisma'
import { Visibility } from '@prisma/client'
import { VisibilityCollapsed } from './Types'

export async function createVisibility(data?: VisibilityCollapsed) : Promise<Visibility> {
    return await prismaCall(() => prisma.visibility.create({
        data: data ? (
            data.type === 'REGULAR' ? {
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
            } : {
                type: 'SPECIAL',
                regularLevel: {
                    create: {
                        permission: data.regular
                    }
                },
                adminLevel: {
                    create:  {
                        permission: data.admin
                    }
                }
            }
        ) : {
            regularLevel: {
                create: {}
            },
            adminLevel: {
                create: {}
            }
        }
    }))
}