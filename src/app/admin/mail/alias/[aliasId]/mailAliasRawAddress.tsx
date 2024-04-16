"use client"

import { createMailAliasRawAddressAction } from "@/actions/mailalias/create";
import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";
import { RawAddressMailAlias } from "@prisma/client";
import { useState } from "react";
import { DeleteableList } from "./deletableList";
import { destroyMailAliasRawAddressAction } from "@/actions/mailalias/destory";

export default function MailAliasRawAddress({
    aliasId,
    rawAddresses,
}: {
    aliasId: number,
    rawAddresses: RawAddressMailAlias[],
}) {
    // TODO: Check if user can update raw addresses

    const [ addresses, setAddresses ] = useState(rawAddresses)

    const [ inputFieldValue, setInputFieldValue ] = useState("")

    return <div>
        <h4>Epostadresser</h4>

        <DeleteableList
            items={addresses.map(a => ({
                id: a.id,
                label: a.address,
            }))}
            deleteFunction={async (id) => {
                const results = await destroyMailAliasRawAddressAction(id)
                if (!results.success) return;
                setAddresses(addresses.filter(a => a.id != results.data.id))
            }}
        />
        <Form
            submitText="Legg til"
            action={createMailAliasRawAddressAction}
            successCallback={data => {
                if(!data) return
                setAddresses(addresses.concat(data))
                setInputFieldValue("")
            }}
        >
            <TextInput
                label="Epost"
                name="rawAddress"
                value={inputFieldValue}
                onChange={e => setInputFieldValue(e.target.value)}
            />
            <input type="hidden" name="id" value={aliasId} />
        </Form>
    </div>
}