'use server'
import { getOwnedFlairsId } from './getData'
import { assignFlairToUserAction, unAssignFlairToUserAction } from '@/services/flairs/actions'


export async function changeAssignment(userId: number, flairId: number) {
    const ownedFlairsId = getOwnedFlairsId(userId)

    if ((await ownedFlairsId).includes(flairId)) {
        unAssignFlairToUserAction({ params: { userId, flairId } })
        return
    }
    assignFlairToUserAction({ params: { userId, flairId } })
}
