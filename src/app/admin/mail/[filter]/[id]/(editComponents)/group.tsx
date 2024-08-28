'use client'
import Form from '@/app/components/Form/Form'
import { SelectNumber } from '@/app/components/UI/Select'
import { createMailingListGroupRelationAction } from '@/actions/mail/create'
import { useUser } from '@/auth/useUser'
import type { MailFlowObject } from '@/server/mail/Types'
import type { MailingList } from '@prisma/client'


export default function EditGroup({
    data,
    mailingLists,
    refreshPage,
}: {
    id: number,
    data: MailFlowObject,
    mailingLists: MailingList[],
    refreshPage: () => Promise<void>
}) {
    const focusedGroup = data.group[0]
    if (!focusedGroup) {
        throw Error('Could not find group')
    }

    const uResults = useUser()
    const permissions = uResults.permissions ?? []

    return <div>
        { permissions.includes('MAILINGLIST_GROUP_CREATE') && <Form
            title="Legg til mailliste"
            submitText="Legg til"
            action={createMailingListGroupRelationAction}
            successCallback={refreshPage}
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
