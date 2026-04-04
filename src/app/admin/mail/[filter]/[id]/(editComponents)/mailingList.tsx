'use client'

import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import { SelectNumber } from '@/components/UI/Select'
import {
    createAliasMailingListRelationAction,
    createMailingListExternalRelationAction,
    createMailingListGroupRelationAction,
    createMailingListUserRelationAction
} from '@/services/mail/actions'
import { updateMailingListAction, destroyMailingListAction } from '@/services/mail/list/actions'
import { mailingListAuth } from '@/services/mail/list/auth'
import { mailAuth } from '@/services/mail/auth'
import { useSession } from '@/auth/session/useSession'
import { useRouter } from 'next/navigation'
import type { MailAddressExternal, MailAlias } from '@/prisma-generated-pn-types'
import type { MailFlowObject } from '@/services/mail/types'


export default function EditMailingList({
    data,
    mailaliases,
    mailAddressExternal,
}: {
    id: number,
    data: MailFlowObject,
    mailaliases: MailAlias[],
    mailAddressExternal: MailAddressExternal[],
}) {
    const { push } = useRouter()

    const focusedMailingList = data.mailingList[0]

    const session = useSession()
    const canAdmin = !session.loading && mailingListAuth.update.dynamicFields({}).auth(session.session).authorized
    const canAddRelation = !session.loading && mailAuth.createAliasMailingListRelation.dynamicFields({}).auth(session.session).authorized

    return <>
        <h2>{focusedMailingList.name}</h2>
        { canAdmin && <div>
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
        { canAdmin && <div>
            <Form
                action={destroyMailingListAction.bind(null, { params: { id: focusedMailingList.id } })}
                successCallback={() => push('/admin/mail')}
                submitText="Slett"
                submitColor="red"
                confirmation={{
                    confirm: true,
                    text: 'Sikker på at du vil slette denne e-post listen? Dette kan ikke angres.',
                }}
            />
        </div> }
        { canAddRelation && <div>
            <Form
                title="Legg til mailalias"
                submitText="Legg til"
                action={createAliasMailingListRelationAction}
            >
                <input type="hidden" value={focusedMailingList.id} name="mailingListId" />
                <SelectNumber
                    options={mailaliases.map(address => ({ value: address.id, label: address.address }))}
                    name="mailAliasId"
                    label="Mailalias"
                />
            </Form>
        </div>}
        { canAddRelation && <div>
            <Form
                title="Grupper"
                submitText="Legg til"
                action={createMailingListGroupRelationAction}
            >
                <input type="hidden" name="mailingListId" value={focusedMailingList.id} />
                <TextInput type="text" name="groupId" label="Gruppe id" />
            </Form>
        </div>}
        { canAddRelation && <div>
            <Form
                title="Brukere"
                submitText="Legg til"
                action={createMailingListUserRelationAction}
            >
                <input type="hidden" name="mailingListId" value={focusedMailingList.id} />
                <TextInput type="text" name="userId" label="Bruker id" />
            </Form>
        </div>}
        { canAddRelation && <div>
            <Form
                title="Ekstern mailadresse"
                submitText="Legg til"
                action={createMailingListExternalRelationAction}
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
