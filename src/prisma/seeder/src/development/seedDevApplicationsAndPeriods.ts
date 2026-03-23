
import type { PrismaClient } from '@/prisma-generated-pn-client'


export default async function seedDevApplicationsAndPeriods(prisma: PrismaClient) {
    const applicationText = `
    Duis dolore minim pariatur quis do ut laboris sit esse laborum quis
    sint.Nisi eu consectetur officia irure proident magna culpa sunt.Lorem 
    reprehenderit pariatur est fugiat ea.Labore aliqua in eu veniam ex velit excepteur 
    sunt amet amet minim voluptate qui pariatur.Exercitation proident cupidatat adipisicing in incididunt 
    excepteur id aliquip sit.Dolor velit deserunt pariatur ipsum velit aute eu eiusmod esse.Voluptate veniam
     esse nostrud duis elit cillum laborum mollit magna consectetur dolore sit commodo.
    `
    const committees = await prisma.committee.findMany({})
    const users = await prisma.user.findMany({})

    const applicationPeriods = await prisma.applicationPeriod.createManyAndReturn({
        data: [
            {
                endDate: new Date('2100-03-25'),
                endPriorityDate: new Date('2100-03-28'),
                name: 'name1',
                startDate: new Date('2026-01-25'),
            },
            {
                endDate: new Date('2025-03-25'),
                endPriorityDate: new Date('2025-03-25'),
                name: 'name2',
                startDate: new Date('2025-03-01'),
            },
            {
                endDate: new Date('2024-03-25'),
                endPriorityDate: new Date('2024-03-25'),
                name: 'name3',
                startDate: new Date('2024-03-01'),
            },
            {
                endDate: new Date('2023-03-25'),
                endPriorityDate: new Date('2023-03-25'),
                name: 'name4',
                startDate: new Date('2023-03-01'),
            },

        ]
    })
    const promises = applicationPeriods.map(prevApplicationPeriod => (
        committees.map(async (committee) => {
            const participation = await prisma.committeeParticipationInApplicationPeriod.create({
                data: {
                    applicationPeriod: {
                        connect: {
                            id: prevApplicationPeriod.id
                        }
                    },
                    committee: {
                        connect: {
                            id: committee.id
                        }
                    }

                }
            })
            await prisma.application.createMany({
                data: users.map(user => ({
                    priority: participation.committeeId,
                    text: applicationText,
                    userId: user.id,
                    applicationPeriodCommiteeId: participation.id,
                    applicationPeriodId: participation.applicationPeriodId,
                })),
            })
        })
    ))
    await Promise.all(promises)
}
