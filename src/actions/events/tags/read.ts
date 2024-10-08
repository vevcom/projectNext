'use server'
import { ActionNoData } from "@/actions/Action"
import { EventTags } from "@/services/events/tags"

export const readEventTagsAction = ActionNoData(EventTags.readAll)
export const readEventTagAction = ActionNoData(EventTags.read)
