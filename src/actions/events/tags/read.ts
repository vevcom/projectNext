'use server'
import { ActionNoData } from "@/actions/Action"
import { EventTags } from "@/services/events/tags"

export const readEventTags = ActionNoData(EventTags.readAll)
export const readEventTag = ActionNoData(EventTags.read)
