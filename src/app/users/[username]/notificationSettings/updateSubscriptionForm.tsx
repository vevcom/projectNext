'use client'
import { updateSubscriptionAction } from '@/actions/notifications/subscription/update'
import Form from '@/app/components/Form/Form'
import NotificationMethodSelector from '@/app/components/NotificaionMethodSelector/NotificaionMethodSelector'
import type { NotificationChannel, NotificationMethod } from '@/server/notifications/Types'


export default function UpdateSubscriptionForm({
    channel,
    methods,
}: {
    channel: NotificationChannel,
    methods: NotificationMethod,
}) {
    return <Form
        submitText="Lagre"
        action={updateSubscriptionAction}
        successCallback={data => {
            console.log(data)
        }}
    >
        <input type="hidden" name="channelId" value={channel.id} />
        <NotificationMethodSelector methods={methods} editable={channel.availableMethods}/>
    </Form>
}
