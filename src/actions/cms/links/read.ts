'use server'

import { action } from '@/actions/action'
import { readSpecialCmsLink } from '@/services/cms/links/read'

export const readSpecialCmsLinkAction = action(readSpecialCmsLink)
