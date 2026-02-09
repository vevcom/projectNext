'use client'
import { useSession } from '@/auth/session/useSession'
import Form from '@/components/Form/Form'
import { SelectNumber } from '@/components/UI/Select'
import { createMailingListGroupRelationAction } from '@/services/mail/actions'
import type { MailFlowObject } from '@/services/mail/types'
import type { MailingList } from '@/prisma-generated-pn-types'


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
    const session = useSession()
    const permissions = !session.loading ? session.session.permissions : []

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
