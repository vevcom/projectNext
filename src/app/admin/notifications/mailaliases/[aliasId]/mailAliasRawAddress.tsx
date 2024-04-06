"use client"

import { createMailAliasRawAddressAction } from "@/actions/mailalias/create";
import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";
import { RawAddressMailAlias } from "@prisma/client";
import { useState } from "react";

export default function MailAliasRawAddress({
    aliasId,
    rawAddresses,
}: {
    aliasId: number,
    rawAddresses: RawAddressMailAlias[],
}) {
    // TODO: Check if user can update raw addresses

    const [ addresses, setAddresses ] = useState(rawAddresses);


    return <div>
        <ul>
            {addresses.map(a => {
                return <li>
                    {a.address}
                </li>
            })}
        </ul>

        <Form
            submitText="Legg til"
            action={createMailAliasRawAddressAction}
            successCallback={data => {
                if(!data) return
                setAddresses(addresses.concat(data))
            }}
        >
            <input type="hidden" name="id" value={aliasId} />
            <TextInput label="Epost adresse" name="rawAddress"/>
        </Form>
    </div>
}