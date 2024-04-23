"use client"

import TextInput from "@/app/components/UI/TextInput";
import Form from "@/app/components/Form/Form";
import { MailFlowObject } from "@/server/mail/Types";
import Select from "@/app/components/UI/Select";
import { MailingList } from "@prisma/client";
import { createMailingListExternalRelationAction } from "@/actions/mail/create";



export default function EditMailAddressExternal({
    id,
    data,
    mailingLists
}: {
    id: number,
    data: MailFlowObject,
    mailingLists: MailingList[]
}) {

    const focusedAddress = data.mailaddressExternal[0];
    if (!focusedAddress) {
        throw Error("Could not find alias");
    }

    return <>
        <div>
            <Form
                title="Ekstern mailaddresse"
                submitText="Oppdater"
            >
                <TextInput name="address" label="Epost" defaultValue={focusedAddress.address} />
                <TextInput name="description" label="Beskrivelse" defaultValue={focusedAddress.description} />
            </Form>
        </div>
        <div>
            <Form
                title="Legg til mailliste"
                submitText="Legg til"
                action={createMailingListExternalRelationAction}
            >
                <input type="hidden" name="mailAddressExternalId" value={focusedAddress.id} />
                <Select options={mailingLists.map(list => ({value: list.id, label: list.name}))} name="mailingListId" label="Mailliste"/>
            </Form>
        </div>
    </>
}