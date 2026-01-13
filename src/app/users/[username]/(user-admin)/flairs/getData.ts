'use server'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import { readUserFlairsIdAction } from '@/services/flairs/actions'


export async function getUserId(username: string) {
    const profile = await getProfileForAdmin({ username }, 'flairs')
    return profile.profile.user.id
}
export async function getOwnedFlairsId(userId: number) {
    const flairs = unwrapActionReturn(await readUserFlairsIdAction({ params: { userId } }))
    return flairs.Flairs.map((data) => data.id)
}
