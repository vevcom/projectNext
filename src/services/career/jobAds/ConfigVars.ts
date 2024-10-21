import { articleRealtionsIncluder } from '@/cms/articles/ConfigVars'
import { JobType, Prisma } from '@prisma/client'

export const jobAdArticleRealtionsIncluder = {
    article: {
        include: articleRealtionsIncluder
    },
    company: true
} as const satisfies Prisma.JobAdInclude

export const simpleJobAdArticleRealtionsIncluder = {
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
} as const satisfies Prisma.JobAdInclude

export const JobTypeConfig = {
    FULL_TIME: { label: 'Heltid' },
    PART_TIME: { label: 'Deltid' },
    INTERNSHIP: { label: 'Internship' },
    OTHER: { label: 'Annet' },
    CONTRACT: { label: 'Kontrakt' },
} as const satisfies Record<JobType, { label: string }>

export const JobTypeOptions = Object.values(JobType).map(opt => ({
    value: opt,
    label: JobTypeConfig[opt].label
}))
