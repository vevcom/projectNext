import { articleRealtionsIncluder } from '@/cms/articles/ConfigVars'
import { JobType } from '@prisma/client'
import type { Prisma } from '@prisma/client'


export namespace JobAdConfig {
    export const type = {
        FULL_TIME: { label: 'Heltid' },
        PART_TIME: { label: 'Deltid' },
        INTERNSHIP: { label: 'Internship' },
        OTHER: { label: 'Annet' },
        CONTRACT: { label: 'Kontrakt' },
    } satisfies Record<JobType, { label: string }>
    export const relationIncluder = {
        article: {
            include: articleRealtionsIncluder
        },
        company: true
    } as const satisfies Prisma.JobAdInclude
    export const simpleRelationIncluder = {
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
    export const options = Object.values(JobType).map((opt): { value: JobType, label: string } => ({
        value: opt,
        label: type[opt].label
    }))
}
