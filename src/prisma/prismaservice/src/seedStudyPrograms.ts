import type { PrismaClient } from '@prisma/client'

export default async function seedStudyPrograms(prisma: PrismaClient) {

    await prisma.studyProgram.createMany({
        data: [
            {
                name: 'Kybernetikk og Robotikk',
                code: 'MTTK',
                years: 5,
            },
            {
                name: 'Elektronisk Systemdesign og Innovasjon',
                code: 'MTEL',
                years: 5,
            },
            {
                name: 'Kybernetikk og Robotikk Master',
                code: 'MITK',
                years: 2,
            },
        ]
    })
}
