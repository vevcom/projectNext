"use client"
import Form from "@/app/components/Form/Form";
import Select from "@/app/components/UI/Select";
import { MailAlias } from "@prisma/client";
import { useState } from "react";


export default function MailAliasForward({
    aliasId,
    addresses,
    title,
    possibleOptions,
    chooseSource,
}: {
    aliasId: number,
    addresses: MailAlias[],
    title: string,
    possibleOptions: MailAlias[],
    chooseSource: boolean,
}) {

    const [ relAdr, setRelAdr ] = useState(addresses)

    console.log(aliasId)

    return <div>
        <h4>{title}</h4>

        <ul>
            {relAdr.map(a => 
                <li>{a.address}</li>
            )}
        </ul>

        <Form
            submitText="Legg til"
        >
            <input
                type="hidden"
                value={aliasId}
                name={chooseSource ? "dranId" : "sourceId"}
            />
            <Select
                name={chooseSource ? "sourceId" : "drainId"}
                label="Alias"
                options={possibleOptions.map(a => ({value: a.id, label: a.address}))}
            />
        </Form>
    </div>
}