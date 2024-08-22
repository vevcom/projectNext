'use client'

import Form from '@/app/components/Form/Form'
import { SelectNumber } from '@/app/components/UI/Select'
import { createMailingListUserRelationAction } from '@/actions/mail/create'
import { useUser } from '@/auth/useUser'
import type { MailFlowObject } from '@/server/mail/Types'
import type { MailingList } from '@prisma/client'

export default function EditUser({
    data,
    mailingLists
}: {
    id: number,
    data: MailFlowObject,
    mailingLists: MailingList[]
}) {
    const focusedUser = data.user[0]
    if (!focusedUser) {
        throw Error('Could not find user')
    }

    const uResults = useUser()
    const permissions = uResults.permissions ?? []

    return <div>
        <h2>{`${focusedUser.firstname} ${focusedUser.lastname}`}</h2>
        { permissions.includes('MAILINGLIST_USER_CREATE') && <Form
            title="Legg til mailliste"
            submitText="Legg til"
            action={createMailingListUserRelationAction}
        >
            <input type="hidden" name="userId" value={focusedUser.id} />
            <SelectNumber
                options={mailingLists.map(list => ({ value: list.id, label: list.name }))}
                name="mailingListId"
                label="Mailliste"
            />
        </Form>}
    </div>
}
