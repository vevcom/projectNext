import 'server-only'
import { fetchStudyProgrammesFromFeide } from './api'
import { upsertStudyProgrammes } from '@/server/groups/studyProgrammes/create'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import prisma from '@/prisma'

export async function updateUserStudyProgrammes(userId: number, accessToken: string) {
    const feideStudyProgrammes = await fetchStudyProgrammesFromFeide(accessToken)
    const studyProgrammes = await upsertStudyProgrammes(feideStudyProgrammes)

    const order = (await readCurrenOmegaOrder()).order

    // Find current user study programmes
    const memberships = await prisma.membership.findMany({
        where: {
            userId,
            group: {
                groupType: 'STUDY_PROGRAMME',
            },
        },
        include: {
            group: {
                include: {
                    studyProgramme: true,
                },
            },
        },
    })

    const userStudyProgrammeCodes = new Set(memberships
        .map(m => m.group.studyProgramme?.code)
        .filter(s => s) as string[]
    )

    const addStudyProgrammes = studyProgrammes.filter(s => !userStudyProgrammeCodes.has(s.code))

    const feideStudyProgrammesCodes = new Set(feideStudyProgrammes.map(f => f.code))

    const updateStudyProgrammes = memberships.filter(m =>
        m.group.studyProgramme?.insititueCode &&
        feideStudyProgrammesCodes.has(m.group.studyProgramme?.insititueCode)
    ).filter(m => m.order !== order)

    await prisma.membership.createMany({
        data: addStudyProgrammes.map(s => ({
            groupId: s.groupId,
            order,
            admin: false,
            userId,
        }))
    })

    await prisma.membership.createMany({
        data: updateStudyProgrammes.map(m => ({
            groupId: m.groupId,
            order,
            admin: m.admin,
            userId,
        }))
    })
}
