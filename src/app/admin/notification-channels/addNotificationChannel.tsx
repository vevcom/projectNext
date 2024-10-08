'use client'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { SelectNumber } from '@/components/UI/Select'
import NotificationMethodSelector from '@/components/NotificaionMethodSelector/NotificaionMethodSelector'
import { allMethodsOff, allMethodsOn } from '@/services/notifications/Types'
import { createNotificationChannelAction } from '@/actions/notifications/channel/create'
import { booleanOperationOnMethods } from '@/services/notifications/notificationMethodOperations'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ExpandedNotificationChannel, NotificationMethodGeneral } from '@/services/notifications/Types'


export default function AddNotificationChannel({
    channels
}: {
    channels: ExpandedNotificationChannel[]
}) {
    const { push } = useRouter()

    const [availableMethods, setAvailableMethods] = useState(allMethodsOn as NotificationMethodGeneral)
    const [defaultMethods, setDefaultMethods] = useState(allMethodsOff as NotificationMethodGeneral)
    const [selectedParentId, setSelectedParentId] = useState(channels.find(c => c.special === 'ROOT')?.id)
    const [editableMethods, setEditableMethods] = useState(
        channels.find(c => c.id === selectedParentId)?.availableMethods ?? allMethodsOn
    )

    function handleNewParent(id: number) {
        setSelectedParentId(id)
        setEditableMethods(channels.find(c => c.id === id)?.availableMethods ?? allMethodsOn)
    }

    return <Form
        title="Legg til varslingskanal"
        submitText="Legg til"
        action={createNotificationChannelAction}
        successCallback={(data) => {
            if (data) {
                push(`notificationchannels/${data.id}`)
            }
        }}
    >
        <TextInput name="name" label="Navn" />
        <TextInput name="description" label="Beskrivelse" />

        <SelectNumber
            label="Forelder"
            name="parentId"
            options={channels.map(channel => ({ value: channel.id, label: channel.name }))}
            value={selectedParentId}
            onChange={handleNewParent}
        />

        <NotificationMethodSelector
            formPrefix="availableMethods"
            title="Tilgjengelige metoder"
            methods={availableMethods}
            editable={editableMethods}
            onChange={setAvailableMethods}
        />

        <NotificationMethodSelector
            formPrefix="defaultMethods"
            title="Standard metoder"
            methods={defaultMethods}
            editable={booleanOperationOnMethods(editableMethods, availableMethods, 'AND')}
            onChange={setDefaultMethods}
        />

    </Form>
}
