'use client'

import styles from './channelSettings.module.scss'
import NotificationMethodSelector from '@/components/NotificaionMethodSelector/NotificaionMethodSelector'
import TextInput from '@/app/components/UI/TextInput'
import Select from '@/app/components/UI/Select'
import Form from '@/app/components/Form/Form'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { findValidParents } from '@/server/notifications/channel/validation'
import { updateNotificationChannelAction } from '@/actions/notifications/channel/update'
import { useState } from 'react'
import type { NotificationChannel } from '@/server/notifications/Types'
import type { MailAlias } from '@prisma/client'

export default function ChannelSettings({
    currentChannel,
    channels,
    mailAliases,
}: {
    currentChannel: NotificationChannel,
    channels: NotificationChannel[],
    mailAliases: MailAlias[],
}) {
    const [currentChannelState, setCurrentChannel] = useState(currentChannel)

    const selectOptions = findValidParents(currentChannel.id, channels)

    return <PageWrapper
        title={currentChannelState.name}
    >
        <div className={styles.channelSettings}>
            {currentChannelState.special ? <p>Spesiell: {currentChannelState.special}</p> : null}
            <Form
                action={updateNotificationChannelAction}
                submitText="Lagre"
            >
                <input type="hidden" name="id" value={currentChannelState.id} />

                <TextInput label="Navn" name="name" defaultValue={currentChannelState.name} onChange={(e) => {
                    const value = e.target.value
                    setCurrentChannel({
                        ...currentChannelState,
                        name: value,
                    })
                }} />
                <div className={styles.widerDiv}>
                    <TextInput
                        label="Beskrivelse"
                        name="description"
                        defaultValue={currentChannelState.description ?? ''}
                        className={styles.descriptionInput}
                    />
                </div>

                <div className={styles.widerDiv}>
                    {currentChannelState.special !== 'ROOT' ?
                        <Select
                            label="Forelder"
                            name="parentId"
                            options={selectOptions.map(c => ({ value: c.id, label: c.name }))}
                            value={currentChannelState.parentId}
                            onChange={(v) => setCurrentChannel({...currentChannelState, parentId: v})}
                        />
                        :
                        <input type="hidden" name="parentId" value={currentChannelState.parentId} />
                    }
                </div>

                <div className={styles.widerDiv}>
                    <Select
                        label="Alias"
                        name="mailAliasId"
                        options={mailAliases.map(a => ({ value: a.id, label: a.address }))}
                        value={currentChannelState.mailAliasId}
                        onChange={(v) => setCurrentChannel({...currentChannelState, mailAliasId: v})}
                    />
                </div>

                <div className={styles.methodContainer}>

                    <NotificationMethodSelector
                        formPrefix="availableMethods"
                        title="Tilgjengelige metoder"
                        methods={currentChannelState.availableMethods}
                        onChange={(data) => {
                            setCurrentChannel({
                                ...currentChannelState,
                                availableMethods: data,
                            })
                        }}
                    />
                    <NotificationMethodSelector
                        formPrefix="defaultMethods"
                        title="Standard metoder"
                        methods={currentChannelState.defaultMethods}
                        editable={currentChannelState.availableMethods}
                        onChange={(data) => {
                            setCurrentChannel({
                                ...currentChannelState,
                                defaultMethods: data,
                            })
                        }}
                    />

                </div>


            </Form>
        </div>
    </PageWrapper>
}
