import '@pn-server-only'
import { fetchStudyProgrammesFromFeide } from './api'
import { upsertStudyProgrammes } from '@/services/groups/studyProgrammes/create'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import prisma from '@/prisma'

export async function updateUserStudyProgrammes(userId: number, accessToken: string) {
    const feideStudyProgrammes = await fetchStudyProgrammesFromFeide(accessToken)
    const studyProgrammes = await upsertStudyProgrammes(feideStudyProgrammes)

    const { order } = await readCurrentOmegaOrder()

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
        .map(membership => membership.group.studyProgramme?.code)
        .filter(studyCode => studyCode) as string[]
    )

    const addStudyProgrammes = studyProgrammes.filter(studyProg => !userStudyProgrammeCodes.has(studyProg.code))

    const feideStudyProgrammesCodes = new Set(
        feideStudyProgrammes.map(feideStudyProgram => feideStudyProgram.code)
    )

    const updateStudyProgrammes = memberships.filter(membership =>
        membership.group.studyProgramme?.insititueCode &&
        feideStudyProgrammesCodes.has(membership.group.studyProgramme?.insititueCode)
    ).filter(membership => membership.order !== order)

    await prisma.membership.createMany({
        data: addStudyProgrammes.map(studyProg => ({
            groupId: studyProg.groupId,
            order,
            admin: false,
            active: true,
            userId,
        }))
    })

    await prisma.membership.createMany({
        data: updateStudyProgrammes.map(membership => ({
            groupId: membership.groupId,
            order,
            admin: membership.admin,
            active: membership.active,
            userId,
        }))
    })
}
