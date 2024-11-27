'use server'
import { Action, ActionNoData } from '@/actions/Action'
import { Cabin } from '@/services/cabin'


export const createRoomAction = Action(Cabin.createRoom)
export const readRoomsAction = ActionNoData(Cabin.readRooms)

export const createBookingPeriodAction = Action(Cabin.createBookingPeriod)
export const readAllBookingPeriodsAction = ActionNoData(Cabin.readAllBookingPeriods)

export const createReleaseGroupAction = ActionNoData(Cabin.createReleaseGroup)
export const readReleaseGroupsAction = ActionNoData(Cabin.readReleaseGroups)
export const readReleaseGroupAction = ActionNoData(Cabin.readReleaseGroup)
export const updateReleaseGroupAction = Action(Cabin.updateReleaseGroup)
export const updateReleaseGroupBookingPeriodsAction = ActionNoData(Cabin.updateReleaseGroupBookingPeriods)
export const deleteReleaseGroupAction = ActionNoData(Cabin.deleteReleaseGroup)
