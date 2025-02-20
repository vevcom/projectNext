import { articleRealtionsIncluder } from '@/cms/articles/ConfigVars'
import { JobType } from '@prisma/client'
import type { Prisma } from '@prisma/client'

export const jobAdConfig = {
    relationIncluder: {
        article: {
            include: articleRealtionsIncluder
        },
        company: true
    } satisfies Prisma.JobAdInclude,
    simpleRelationIncluder: {
        company: {
            select: {
                name: true,
            }
        },
        article: {
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        }
    } satisfies Prisma.JobAdInclude,
    typeConfig: {
        FULL_TIME: { label: 'Heltid' },
        PART_TIME: { label: 'Deltid' },
        INTERNSHIP: { label: 'Internship' },
        OTHER: { label: 'Annet' },
        CONTRACT: { label: 'Kontrakt' },
    } satisfies Record<JobType, { label: string }>,
    options: Object.values(JobType).map((opt): { value: JobType, label: string } => ({
        value: opt,
        label: jobAdConfig.typeConfig[opt].label
    }))
} as const