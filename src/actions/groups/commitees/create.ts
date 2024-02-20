import { ActionReturn } from "@/actions/type"
import type { Committe } from './Types'
import errorHandler from "@/prisma/errorHandler"

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
    } catch(e) {
        return errorHandler(e)
    }
}