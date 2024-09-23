import { Event } from "@prisma/client";
import { eventFieldsToExpose } from "./ConfigVars";
import { ExpandedCmsImage } from "../cms/images/Types";

export type EventFiltered = Pick<Event, typeof eventFieldsToExpose[number]>

export type EventFilteredWithImage =  EventFiltered & {
    coverImage: Pick<ExpandedCmsImage, 'image'>
}

export type ExpandedEvent = EventFiltered 

export type EventArchiveCursor = { id: number }

export type EventArchiveDetails = { name?: string }