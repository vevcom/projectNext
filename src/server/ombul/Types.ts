import type { CmsImage, Image, Ombul } from '@prisma/client'

export type ExpandedOmbul = Ombul & {
    coverImage: CmsImage & {
        image: Image | null
    }
}

type OptionalFields = 'year' | 'issueNumber'
type RequiredFields = 'name' | 'description'

export type OmbulCreateConfig = Required<Pick<Ombul, RequiredFields>> & Partial<Pick<Ombul, OptionalFields>>
