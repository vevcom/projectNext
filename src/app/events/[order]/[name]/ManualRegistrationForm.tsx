'use client'
import styles from './ManualRegistrationForm.module.scss'
import Form from '@/components/Form/Form'
import UserList from '@/components/User/UserList/UserList'
import UserPagingProvider from '@/contexts/paging/UserPaging'
import UserSelectionProvider, { UserSelectionContext } from '@/contexts/UserSelection'
import TextInput from '@/components/UI/TextInput'
import { bindParams } from '@/services/actionBind'
import { createEventRegistrationAction, createGuestEventRegistrationAction } from '@/services/events/registration/actions'
import { useContext } from 'react'
import type { EventRegistration } from '@prisma/client'
import type { ActionReturn } from '@/services/actionTypes'

function ManualRegistrationFormInner({
    eventId,
}: {
    eventId: number,
}) {
    const userSelectionContext = useContext(UserSelectionContext)
    if (!userSelectionContext) throw new Error('UserSelectionContext not found')

    const action = async (): Promise<ActionReturn<{
        result: EventRegistration
    }>> => {
        if (!userSelectionContext.user) {
            return {
                success: false,
                errorCode: 'BAD PARAMETERS',
                httpCode: 400,
                error: [{
                    message: 'Ingen bruker er valgt'
                }]
            }
        }

        console.log(eventId)
        console.log(userSelectionContext.user.id)

        return await createEventRegistrationAction({
            eventId,
            userId: userSelectionContext.user.id,
        })
    }

    return <Form
        submitText="Registrer valgt bruker"
        title="Registrer bruker manuelt"
        action={action}
    >
    </Form>
}

export default function ManualRegistrationForm({
    eventId,
}: {
    eventId: number,
}) {
    return <div className={styles.ManualRegistrationForm}>
        <Form
            submitText="Registrer gjest"
            title="Register gjest uten bruker"
            action={bindParams(createGuestEventRegistrationAction, { eventId })}
        >
            <TextInput name="name" label="Navn" />
            <TextInput name="note" label="Notat" />
        </Form>
        <UserPagingProvider
            serverRenderedData={[]}
            startPage={{
                pageSize: 50,
                page: 0,
            }}
            details={{
                groups: [],
                partOfName: ''
            }}
        >
            <UserSelectionProvider>
                <ManualRegistrationFormInner eventId={eventId} />
                <UserList />
            </UserSelectionProvider>
        </UserPagingProvider>
    </div>
}
