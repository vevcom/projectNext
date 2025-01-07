'use server'

import { Action } from '@/actions/Action'
import { readSpecialCmsLink } from '@/services/cms/links/read'

export const readSpecialCmsLinkAction = Action(readSpecialCmsLink)
