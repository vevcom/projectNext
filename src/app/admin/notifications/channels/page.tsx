
import { useUser } from "@/auth/client"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper"
import { readNotificaitonChannels } from "@/actions/notifications/read"
import ChannelView from "./channelView"
import { notFound } from "next/navigation"
import AdminSelectView from "@/app/components/AdminSelectView/AdminSelectView"

export default async function Channels() {

    /*const {user, status, authorized} = useUser({
        required: true,
    })*/

    const channels = await readNotificaitonChannels();

    console.log(channels)

    if (!channels.success) {
        // TODO: Handle error
        notFound();
    }

    return (
        <PageWrapper title="Varslingskanaler">
            <AdminSelectView list={channels.data}/>
        </PageWrapper>
    )
}