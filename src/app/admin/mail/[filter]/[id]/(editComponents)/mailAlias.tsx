"use client"

import TextInput from "@/app/components/UI/TextInput";
import Form from "@/app/components/Form/Form";
import { MailFlowObject } from "@/server/mail/Types";
import Select from "@/app/components/UI/Select";
import { MailingList } from "@prisma/client";
import { createAliasMailingListRelationAction } from "@/actions/mail/create";



export default function EditMailAlias({
    id,
    data,
    mailingLists
}: {
    id: number,
    data: MailFlowObject,
    mailingLists: MailingList[]
}) {

    const focusedAlias = data.alias[0];
    if (!focusedAlias) {
        throw Error("Could not find alias");
    }

    return <>
        <div>
            <Form
                title="Alias"
                submitText="Oppdater"
            >
                <TextInput name="address" label="Epost" defaultValue={focusedAlias.address} />
                <TextInput name="description" label="Beskrivelse" defaultValue={focusedAlias.description} />
            </Form>
        </div>
        <div>
            <Form
                title="Legg til mailliste"
                submitText="Legg til"
                action={createAliasMailingListRelationAction}
            >
                <input type="hidden" name="mailAliasId" value={focusedAlias.id} />
                <Select options={mailingLists.map(list => ({value: list.id, label: list.name}))} name="mailingListId" label="Mailliste"/>
            </Form>
        </div>
    </>
}