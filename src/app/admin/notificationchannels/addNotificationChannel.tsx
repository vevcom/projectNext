"use client"
import Form from "@/components/Form/Form";
import TextInput from "@/components/UI/TextInput";
import { NotificationChannelWithMethods } from "@/server/notifications/Types";
import Select from "@/components/UI/Select";
import NotificationMethodSelector from "@/components/NotificaionMethodSelector/NotificaionMethodSelector";
import { NotificationMethodsAllOn } from "@/server/notifications/ConfigVars";
import { useState } from "react";
import { createNotificaitonChannel } from "@/actions/notifications/create";

export default function AddNotificationChannel({
    channels
} : {
    channels: NotificationChannelWithMethods[]
}) {

    const [ availableMethods, setAvailableMethods ] = useState(NotificationMethodsAllOn)
    const [ selectedParentId, setSelectedParentId ] = useState(channels.find(c => c.special === "ROOT")?.id)
    const [ editableMethods, setEditableMethods ] = useState(
        channels.find(c => c.id === selectedParentId)?.availableMethods ?? NotificationMethodsAllOn
    )

    function handleNewParent(id: number) {
        setSelectedParentId(id)
        setEditableMethods(channels.find(c => c.id === id)?.availableMethods ?? NotificationMethodsAllOn)
    }

    return <Form
        title="Legg til varslingskanal"
        submitText="Legg til"
        action={createNotificaitonChannel}
    >
        <TextInput name="name" label="Navn" />
        <TextInput name="description" label="Beskrivelse" />

        <Select
            label="Forelder"
            name="parentId"
            options={channels.map(c => ({ value: c.id, label: c.name }))}
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

    </Form>
}