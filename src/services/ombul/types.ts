import type { Image, Ombul } from '@/prisma-generated-pn-types'

export type ExpandedOmbul = Ombul & {
    coverImage: Image
}

type OptionalFields = 'year' | 'issueNumber'
type RequiredFields = 'name' | 'description'

export type OmbulCreateConfig = Required<Pick<Ombul, RequiredFields>> & Partial<Pick<Ombul, OptionalFields>>
