import { ExpandedCmsImage } from "@/services/cms/images/Types";
import { Badge } from "@prisma/client";

export type ExpandedBadge = Badge & {cmsImage: ExpandedCmsImage}