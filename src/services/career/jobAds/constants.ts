import { articleRealtionsIncluder } from '@/cms/articles/constants'
import { JobType } from '@prisma/client'
import type { Prisma } from '@prisma/client'


export const jobAdType = {
    FULL_TIME: { label: 'Heltid' },
    PART_TIME: { label: 'Deltid' },
    INTERNSHIP: { label: 'Internship' },
    OTHER: { label: 'Annet' },
    CONTRACT: { label: 'Kontrakt' },
} satisfies Record<JobType, { label: string }>

export const articleAndCompanyIncluder = {
    article: {
        include: articleRealtionsIncluder
    },
    company: true
} as const satisfies Prisma.JobAdInclude

export const simpleArticleAndCompanyIncluder = {
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

export const jobAdOptions = Object.values(JobType).map((opt): { value: JobType, label: string } => ({
    value: opt,
    label: jobAdType[opt].label
}))
