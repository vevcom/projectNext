"use client"
import { createMailAliasForwardRelationAction } from "@/actions/mailalias/create";
import Form from "@/app/components/Form/Form";
import Select from "@/app/components/UI/Select";
import { MailAlias } from "@prisma/client";
import { useState } from "react";
import {v4 as uuid } from "uuid";

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

    return <div>
        <h4>{title}</h4>

        <ul>
            {relAdr.map(a => 
                <li key={uuid()}>{a.address}</li>
            )}
        </ul>

        <Form
            submitText="Legg til"
            action={createMailAliasForwardRelationAction}
            successCallback={data => {
                if(!data) return;
                console.log(data)
                const idToAdd = chooseSource ? data.sourceId : data.drainId
                const newAlias = possibleOptions.find(a => a.id == idToAdd)
                if (newAlias) {
                    setRelAdr(relAdr.concat(newAlias))
                }
            }}

        >
            <input
                type="hidden"
                value={aliasId}
                name={chooseSource ? "drainId" : "sourceId"}
            />
            <Select
                name={chooseSource ? "sourceId" : "drainId"}
                label="Alias"
                options={possibleOptions.map(a => ({value: a.id, label: a.address}))}
            />
        </Form>
    </div>
}