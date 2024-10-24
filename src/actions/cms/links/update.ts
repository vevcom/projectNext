'use server'
import { Action } from "@/actions/Action"
import { CmsLinks } from "@/services/cms/links"

export const updateCmsLinkAction = Action(CmsLinks.update)
