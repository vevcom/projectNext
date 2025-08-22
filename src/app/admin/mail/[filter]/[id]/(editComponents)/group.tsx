'use client'
import Form from '@/components/Form/Form'
import { SelectNumber } from '@/components/UI/Select'
import { createMailingListGroupRelationAction } from '@/services/mail/actions'
import { useUser } from '@/auth/useUser'
import type { MailFlowObject } from '@/services/mail/Types'
import type { MailingList } from '@prisma/client'


export default function EditGroup({
    data,
    mailingLists
}: {
    id: number,
    data: MailFlowObject,
    mailingLists: MailingList[]
}) {
    const focusedGroup = data.group[0]
    if (!focusedGroup) {
        throw Error('Could not find group')
    }

    const uResults = useUser()
    const permissions = uResults.permissions ?? []

    return <div>
        <h2>{focusedGroup.id}</h2>
        { permissions.includes('MAILINGLIST_GROUP_CREATE') && <Form
            title="Legg til mailliste"
            submitText="Legg til"
            action={createMailingListGroupRelationAction}
        >
            <input type="hidden" name="groupId" value={focusedGroup.id} />
            <SelectNumber
                options={mailingLists.map(list => ({ value: list.id, label: list.name }))}
                name="mailingListId"
                label="Mailliste"
            />
        </Form>}
    </div>
}
