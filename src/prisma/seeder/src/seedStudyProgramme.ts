import type { PrismaClient } from '@/generated/pn'

export default async function seedStudyProgramme(prisma: PrismaClient) {
    await prisma.studyProgramme.create({
        data: {
            name: 'Kybernetikk og robotikk - master (5-årig)',
            code: 'MTTK',
            yearsLength: 5,
            startYear: 1,
            partOfOmega: true,
            group: {
                create: {
                    groupType: 'STUDY_PROGRAMME',
                    order: 105,
                }
            }
        }
    })

    await prisma.studyProgramme.create({
        data: {
            name: 'Elektronisk systemdesign og innovasjon - master (5-årig)',
            code: 'MTELSYS',
            yearsLength: 5,
            startYear: 1,
            partOfOmega: true,
            group: {
                create: {
                    groupType: 'STUDY_PROGRAMME',
                    order: 105,
                }
            }
        }
    })

    await prisma.studyProgramme.create({
        data: {
            name: 'Kybernetikk og robotikk - master (2-årig)',
            code: 'MITK',
            yearsLength: 2,
            startYear: 4,
            partOfOmega: true,
            group: {
                create: {
                    groupType: 'STUDY_PROGRAMME',
                    order: 105,
                }
            }
        }
    })
}
