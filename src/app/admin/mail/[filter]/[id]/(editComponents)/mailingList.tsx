"use client"

import TextInput from "@/app/components/UI/TextInput"
import { MailFlowObject } from "@/server/mail/Types"
import { MailAddressExternal, MailAlias } from "@prisma/client"
import Form from "@/app/components/Form/Form"
import Select from "@/app/components/UI/Select"
import { createAliasMailingListRelationAction, createMailingListExternalRelationAction, createMailingListGroupRelationAction, createMailingListUserRelationAction } from "@/actions/mail/create"
import { UserFiltered } from "@/server/users/Types"
import { useUser } from "@/auth/useUser"


export default function EditMailingList({
    id,
    data,
    mailaliases,
    mailAddressExternal,
}: {
    id: number,
    data: MailFlowObject,
    mailaliases: MailAlias[],
    mailAddressExternal: MailAddressExternal[],
}) {

    const focusedMailingList = data.mailingList[0]

    const uResults = useUser();
    const permissions = uResults.permissions ?? [];

    return <>
        <h2>{focusedMailingList.name}</h2>
        { permissions.includes("MAILINGLIST_UPDATE") && <div>
            <Form
                title="Mailliste"
                submitText="Oppdater"
            >
                <TextInput name="name" label="Navn" defaultValue={focusedMailingList.name} />
                <TextInput name="description" label="Beskrivelse" defaultValue={focusedMailingList.description} />

            </Form>
        </div>}
        { permissions.includes("MAILINGLIST_ALIAS_CREATE") && <div>
            <Form
                title="Legg til mailalias"
                submitText="Legg til"
                action={createAliasMailingListRelationAction}
            >
                <input type="hidden" value={focusedMailingList.id} name="mailingListId" />
                <Select options={mailaliases.map(a => ({value: a.id, label: a.address}))} name="mailAliasId" label="Mailalias" />
            </Form>
        </div>}
        { permissions.includes("MAILINGLIST_GROUP_CREATE") && <div>
            <Form
                title="Grupper"
                submitText="Legg til"
                action={createMailingListGroupRelationAction}
            >
                <input type="hidden" name="mailingListId" value={focusedMailingList.id} />
                <TextInput type="text" name="groupId" label="Gruppe id" />
            </Form>
        </div>}
        { permissions.includes("MAILINGLIST_USER_CREATE") && <div>
            <Form
                title="Brukere"
                submitText="Legg til"
                action={createMailingListUserRelationAction}
            >
                <input type="hidden" name="mailingListId" value={focusedMailingList.id} />
                <TextInput type="text" name="userId" label="Bruker id" />
            </Form>
        </div>} 
        { permissions.includes("MAILADDRESS_EXTERNAL_CREATE") && <div>
            <Form
                title="Ekstern mailadresse"
                submitText="Legg til"
                action={createMailingListExternalRelationAction}
            >
                <input type="hidden" name="mailingListId" value={focusedMailingList.id} />
                <Select options={mailAddressExternal.map(a => ({value: a.id, label: a.address}))} name="mailAddressExternalId" label="Ekstern mail adresse" />
            </Form>
        </div>}
    </>
}