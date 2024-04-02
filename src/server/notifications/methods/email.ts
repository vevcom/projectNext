import 'server-only'

export async function dispatchEmailNotifications(usersIds: number[]): Promise<void> {
    console.log("SEND EMAIL")
    console.log(usersIds)
}