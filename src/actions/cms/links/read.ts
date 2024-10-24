'use server'

import { ActionNoData } from '@/actions/Action'
import { CmsLinks } from '@/services/cms/links'

export const readSpecialCmsLinkAction = ActionNoData(CmsLinks.readSpacial)
