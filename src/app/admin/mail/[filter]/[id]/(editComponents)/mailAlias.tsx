'use client'

import TextInput from '@/app/components/UI/TextInput'
import Form from '@/app/components/Form/Form'
import { SelectNumber } from '@/app/components/UI/Select'
import { createAliasMailingListRelationAction } from '@/actions/mail/create'
import { useUser } from '@/auth/useUser'
import { updateMailAliasAction } from '@/actions/mail/alias/update'
import { destroyMailAliasAction } from '@/actions/mail/alias/destory'
import { useRouter } from 'next/navigation'
import type { MailFlowObject } from '@/server/mail/Types'
import type { MailingList } from '@prisma/client'


export default function EditMailAlias({
    data,
    mailingLists,
    refreshPage,
}: {
    id: number,
    data: MailFlowObject,
    mailingLists: MailingList[],
    refreshPage: () => Promise<void>
}) {
    const { push } = useRouter()

    const focusedAlias = data.alias[0]
    if (!focusedAlias) {
        throw Error('Could not find alias')
    }

    const uResults = useUser()
    const permissions = uResults.permissions ?? []

    return <>
        { permissions.includes('MAILALIAS_UPDATE') && <div>
            <Form
                title="Alias"
                submitText="Oppdater"
                action={updateMailAliasAction}
            >
                <input type="hidden" name="id" value={focusedAlias.id} />
                <TextInput name="address" label="E-post" defaultValue={focusedAlias.address} />
                <TextInput name="description" label="Beskrivelse" defaultValue={focusedAlias.description} />
            </Form>
        </div>}
        { permissions.includes('MAILALIAS_DESTORY') && <div>
            <Form
                action={destroyMailAliasAction.bind(null, focusedAlias.id)}
                successCallback={() => push('/admin/mail')}
                submitText="Slett"
                submitColor="red"
                confirmation={{
                    confirm: true,
                    text: 'Sikker på at du vil slette dette mailaliaset? Dette kan ikke angres.',
                }}
            />
        </div> }
        { permissions.includes('MAILINGLIST_ALIAS_CREATE') && <div>
            <Form
                title="Legg til mailliste"
                submitText="Legg til"
                action={createAliasMailingListRelationAction}
                successCallback={refreshPage}
            >
                <input type="hidden" name="mailAliasId" value={focusedAlias.id} />
                <SelectNumber
                    options={mailingLists.map(list => ({ value: list.id, label: list.name }))}
                    name="mailingListId"
                    label="Mailliste"
                />
            </Form>
        </div>}
    </>
}
