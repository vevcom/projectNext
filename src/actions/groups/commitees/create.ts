'use server'

import errorHandler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { Committe } from './Types'

export async function createCommittee(): Promise<ActionReturn<Committe>> {
    try {
        const { group, ...committee } = await prisma.commitee.create({
            data: {
                group: {
                    create: {
                        groupType: 'COMMITEE',
                        name: 'vevcomiteen',
                        membershipRenewal: true,
                    },
                },
            },
            include: {
                group: true,
            },
        })

        return {
            success: true,
            data: {
                ...committee,
                ...group,
            },
        }
    } catch (e) {
        return errorHandler(e)
    }
}
