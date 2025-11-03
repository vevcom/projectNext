'use client'

import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import { SelectNumber } from '@/components/UI/Select'
import { createMailingListExternalRelationAction } from '@/services/mail/actions'
import {
    updateMailAddressExternalAction,
    destroyMailAddressExternalAction
} from '@/services/mail/mailAddressExternal/actions'
import { useSession } from '@/auth/session/useSession'
import { useRouter } from 'next/navigation'
import type { MailingList } from '@prisma/client'
import type { MailFlowObject } from '@/services/mail/types'


export default function EditMailAddressExternal({
    data,
    mailingLists
}: {
    id: number,
    data: MailFlowObject,
    mailingLists: MailingList[]
}) {
    const { push } = useRouter()

    const focusedAddress = data.mailaddressExternal[0]
    if (!focusedAddress) {
        throw Error('Could not find alias')
    }

    const session = useSession()
    const permissions = !session.loading ? session.session.permissions : []

    return <>
        <h2>{focusedAddress.address}</h2>
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
            >
                <input type="hidden" name="mailAddressExternalId" value={focusedAddress.id} />
                <SelectNumber
                    options={mailingLists.map(list => ({ value: list.id, label: list.name }))}
                    name="mailingListId"
                    label="Mailliste"
                />
            </Form>
        </div>}
    </>
}
