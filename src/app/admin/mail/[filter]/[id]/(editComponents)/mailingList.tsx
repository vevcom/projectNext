'use client'

import TextInput from '@/app/components/UI/TextInput'
import Form from '@/app/components/Form/Form'
import { SelectNumber } from '@/app/components/UI/Select'
import {
    createAliasMailingListRelationAction,
    createMailingListExternalRelationAction,
    createMailingListGroupRelationAction,
    createMailingListUserRelationAction
} from '@/actions/mail/create'
import { useUser } from '@/auth/useUser'
import { updateMailingListAction } from '@/actions/mail/list/update'
import { destroyMailingListAction } from '@/actions/mail/list/destory'
import { useRouter } from 'next/navigation'
import type { MailAddressExternal, MailAlias } from '@prisma/client'
import type { MailFlowObject } from '@/server/mail/Types'


export default function EditMailingList({
    data,
    mailaliases,
    mailAddressExternal,
    refreshPage,
}: {
    id: number,
    data: MailFlowObject,
    mailaliases: MailAlias[],
    mailAddressExternal: MailAddressExternal[],
    refreshPage: () => Promise<void>,
}) {
    const { push } = useRouter()

    const focusedMailingList = data.mailingList[0]

    const uResults = useUser()
    const permissions = uResults.permissions ?? []

    return <>
        { permissions.includes('MAILINGLIST_UPDATE') && <div>
            <Form
                title="Mailliste"
                submitText="Oppdater"
                action={updateMailingListAction}
            >
                <input type="hidden" name="id" value={focusedMailingList.id} />
                <TextInput name="name" label="Navn" defaultValue={focusedMailingList.name} />
                <TextInput name="description" label="Beskrivelse" defaultValue={focusedMailingList.description} />

            </Form>
        </div>}
        { permissions.includes('MAILINGLIST_DESTROY') && <div>
            <Form
                action={destroyMailingListAction.bind(null, focusedMailingList.id)}
                successCallback={() => push('/admin/mail')}
                submitText="Slett"
                submitColor="red"
                confirmation={{
                    confirm: true,
                    text: 'Sikker på at du vil slette denne e-post listen? Dette kan ikke angres.',
                }}
            />
        </div> }
        { permissions.includes('MAILINGLIST_ALIAS_CREATE') && <div>
            <Form
                title="Legg til mailalias"
                submitText="Legg til"
                action={createAliasMailingListRelationAction}
                successCallback={refreshPage}
            >
                <input type="hidden" value={focusedMailingList.id} name="mailingListId" />
                <SelectNumber
                    options={mailaliases.map(address => ({ value: address.id, label: address.address }))}
                    name="mailAliasId"
                    label="Mailalias"
                />
            </Form>
        </div>}
        { permissions.includes('MAILINGLIST_GROUP_CREATE') && <div>
            <Form
                title="Grupper"
                submitText="Legg til"
                action={createMailingListGroupRelationAction}
                successCallback={refreshPage}
            >
                <input type="hidden" name="mailingListId" value={focusedMailingList.id} />
                <TextInput type="text" name="groupId" label="Gruppe id" />
            </Form>
        </div>}
        { permissions.includes('MAILINGLIST_USER_CREATE') && <div>
            <Form
                title="Brukere"
                submitText="Legg til"
                action={createMailingListUserRelationAction}
                successCallback={refreshPage}
            >
                <input type="hidden" name="mailingListId" value={focusedMailingList.id} />
                <TextInput type="text" name="userId" label="Bruker id" />
            </Form>
        </div>}
        { permissions.includes('MAILADDRESS_EXTERNAL_CREATE') && <div>
            <Form
                title="Ekstern mailadresse"
                submitText="Legg til"
                action={createMailingListExternalRelationAction}
                successCallback={refreshPage}
            >
                <input type="hidden" name="mailingListId" value={focusedMailingList.id} />
                <SelectNumber
                    options={mailAddressExternal.map(address => ({ value: address.id, label: address.address }))}
                    name="mailAddressExternalId"
                    label="Ekstern mail adresse"
                />
            </Form>
        </div>}
    </>
}
