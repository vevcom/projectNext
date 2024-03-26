
import PageWrapper from "@/app/components/PageWrapper/PageWrapper"
import { readNotificaitonChannels } from "@/actions/notifications/read"
import ChannelView from "./channelView"
import { notFound } from "next/navigation"
import { getUser } from "@/auth/getUser"
import AddHeaderItemPopUp from "@/app/components/AddHeaderItem/AddHeaderItemPopUp"
import AddNotificationChannel from "./addNotificationChannel"

export default async function Channels({ params } : {
    params: {
        currentId: string
    }

}) {

    await getUser({
        requiredPermissions: [[ 'NOTIFICATION_CHANNEL_READ' ]],
        userRequired: true,
        shouldRedirect: true,
    });

    const channels = await readNotificaitonChannels();

    if (!channels.success) {
        // TODO: Handle error
        notFound();
    }

    return (
        <PageWrapper
            title="Varslingskanaler"
            headerItem={
                <AddHeaderItemPopUp PopUpKey="createNewsPop">
                    <AddNotificationChannel channels={channels.data}/>
                </AddHeaderItemPopUp>
            }
        >
            <ChannelView channels={channels.data} currentId={Number(params.currentId)}/>
        </PageWrapper>
    )
}