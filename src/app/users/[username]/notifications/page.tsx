'use server'
import NotificationSettings from './notificationSettings'
import { readNotificationChannelsAction } from '@/actions/notifications/channel/read'
import { readSubscriptionsAction } from '@/actions/notifications/subscription/read'
import SpecialCmsParagraph from '@/app/components/Cms/CmsParagraph/SpecialCmsParagraph'
import { HelpHeaderItemPopUp } from '@/app/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { v4 as uuid } from 'uuid'

export default async function Notififcations() {
    // TODO: Make mobile friendly

    const [channels, subscriptions] = await Promise.all([
        readNotificationChannelsAction(),
        readSubscriptionsAction(),
    ])

    if (!channels.success || !subscriptions.success) {
        throw new Error('Failed to load channels or subscriptions')
    }

    return <PageWrapper
        title="Varslinger"
        headerItem={
            <HelpHeaderItemPopUp
                PopUpKey={uuid()}
            >
                <SpecialCmsParagraph special='HELP_SUBSCRIPTIONS'/>
            </HelpHeaderItemPopUp>
        }
    >
        <NotificationSettings channels={channels.data} subscriptions={subscriptions.data} />
    </PageWrapper>
}
