import 'server-only'
import { upsertStudyProgrammes } from '@/server/groups/studyProgrammes/create'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import { fetchStudyProgrammesFromFeide } from './api'
import prisma from '@/prisma'

export async function updateUserStudyProgrammes(userId: number, access_token: string) {

    const feideStudyProgrammes = await fetchStudyProgrammesFromFeide(access_token)
    const studyProgrammes = await upsertStudyProgrammes(feideStudyProgrammes)

    const order = (await readCurrenOmegaOrder()).order

    // This prisma call will probably break a lot of things
    // It will delete the memberships for all users
    // I think we need to diguss this
    await prisma.membership.deleteMany({
        where: {
            OR: studyProgrammes.map(({ groupId }) => ({
                groupId,
                order,
            }))
        }
    })

    await prisma.membership.createMany({
        data: studyProgrammes.map(({ groupId }) => ({
            groupId,
            order,
            admin: false,
            userId,
        }))
    })
}