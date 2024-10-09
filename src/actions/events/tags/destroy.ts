'use server'
import { ActionNoData } from '@/actions/Action'
import { EventTags } from '@/services/events/tags'

export const destroyEventTagAction = ActionNoData(EventTags.destroy)
