'use server'
import { Action, ActionNoData } from '@/actions/Action'
import { Cabin } from '@/services/cabin'


export const createRoomAction = Action(Cabin.createRoom)
export const readRoomsAction = ActionNoData(Cabin.readRooms)

export const createBookingPeriodAction = Action(Cabin.createBookingPeriod)

