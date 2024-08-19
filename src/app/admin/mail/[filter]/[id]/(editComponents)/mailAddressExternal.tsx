'use client'

import TextInput from '@/app/components/UI/TextInput'
import Form from '@/app/components/Form/Form'
import Select from '@/app/components/UI/Select'
import { createMailingListExternalRelationAction } from '@/actions/mail/create'
import { useUser } from '@/auth/useUser'
import { updateMailAddressExternalAction } from '@/actions/mail/mailAddressExternal/update'
import { destroyMailAddressExternalAction } from '@/actions/mail/mailAddressExternal/destroy'
import { useRouter } from 'next/navigation'
import type { MailingList } from '@prisma/client'
import type { MailFlowObject } from '@/server/mail/Types'


export default function EditMailAddressExternal({
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

    const focusedAddress = data.mailaddressExternal[0]
    if (!focusedAddress) {
        throw Error('Could not find alias')
    }

    const uResults = useUser()
    const permissions = uResults.permissions ?? []

    return <>
        { permissions.includes('MAILADDRESS_EXTERNAL_UPDATE') && <div>
            <Form
                title="Ekstern mailaddresse"
                submitText="Oppdater"
                action={updateMailAddressExternalAction}
            >
                <input type="hidden" name="id" value={focusedAddress.id} />
                <TextInput name="address" label="E-post" defaultValue={focusedAddress.address} />
                <TextInput name="description" label="Beskrivelse" defaultValue={focusedAddress.description} />
            </Form>
        </div>}
        { permissions.includes('MAILADDRESS_EXTERNAL_DESTROY') && <div>
            <Form
                action={destroyMailAddressExternalAction.bind(null, focusedAddress.id)}
                successCallback={() => push('/admin/mail')}
                submitText="Slett"
                submitColor="red"
                confirmation={{
                    confirm: true,
                    text: 'Sikker på at du vil slette denne eksterne addressen? Dette kan ikke angres.',
                }}
            />
        </div> }
        { permissions.includes('MAILINGLIST_EXTERNAL_ADDRESS_CREATE') && <div>
            <Form
                title="Legg til mailliste"
                submitText="Legg til"
                action={createMailingListExternalRelationAction}
                successCallback={refreshPage}
            >
                <input type="hidden" name="mailAddressExternalId" value={focusedAddress.id} />
                <Select
                    options={mailingLists.map(list => ({ value: list.id, label: list.name }))}
                    name="mailingListId"
                    label="Mailliste"
                />
            </Form>
        </div>}
    </>
}
