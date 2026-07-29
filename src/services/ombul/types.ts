import type { CmsParagraph, Ombul } from '@/prisma-generated-pn-types'
import type { ExpandedImage } from '@/services/images/subservice/types'

export type ExpandedOmbul = Ombul & {
    coverImage: ExpandedImage
    paragraph: CmsParagraph
}

type OptionalFields = 'year' | 'issueNumber'
type RequiredFields = 'name' | 'description'

export type OmbulCreateConfig = Required<Pick<Ombul, RequiredFields>> & Partial<Pick<Ombul, OptionalFields>>
