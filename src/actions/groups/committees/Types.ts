import type { Committee } from "@prisma/client"
import type { ExpandedCmsImage } from "@/actions/cms/images/Types"

export type ExpandedCommittee = Committee & {
    logoImage: ExpandedCmsImage
}