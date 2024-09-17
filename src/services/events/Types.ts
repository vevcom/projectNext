import { Event } from "@prisma/client";
import { eventFieldsToExpose } from "./ConfigVars";

export type EventFiltered = Pick<Event, typeof eventFieldsToExpose[number]>

export type ExpandedEvent = EventFiltered 