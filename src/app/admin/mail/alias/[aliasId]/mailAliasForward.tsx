"use client"
import { createMailAliasForwardRelationAction } from "@/actions/mail/alias/create";
import Form from "@/app/components/Form/Form";
import Select from "@/app/components/UI/Select";
import { MailAlias } from "@prisma/client";
import { useState } from "react";
import { DeleteableList } from "./deletableList";
import { destroyMailAliasForwardAction } from "@/actions/mail/alias/destory";

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
    const [ options, setOptions ] = useState(possibleOptions)

    const chooseField = chooseSource ? "sourceId" : "drainId"
    const fixedField = chooseSource ? "drainId" : "sourceId" 

    return <div>
        <h4>{title}</h4>

        <DeleteableList
            items={relAdr.map(a => ({
                id: a.id,
                label: a.address,
            }))}
            deleteFunction={async (id) => {
                const results = await destroyMailAliasForwardAction({
                    [chooseField]: id,
                    [fixedField]: aliasId,
                } as {
                    sourceId: number,
                    drainId: number,
                })

                if (!results.success) return;
                setRelAdr(relAdr.filter(a => a.id != id))
                const deletedAddress = possibleOptions.find(a => a.id === id)
                console.log(deletedAddress)
                console.log(possibleOptions)
                // This doent work sine posible options doesnt include all aliases
                if (deletedAddress) {
                    setOptions(options.concat(deletedAddress))
                }
            }}
        />

        <Form
            submitText="Legg til"
            action={createMailAliasForwardRelationAction}
            successCallback={data => {
                if(!data) return;
                const idToAdd = chooseSource ? data.sourceId : data.drainId
                const newAlias = possibleOptions.find(a => a.id == idToAdd)
                if (newAlias) {
                    setRelAdr(relAdr.concat(newAlias))
                    setOptions(options.filter(a => a.id != idToAdd))
                }
            }}

        >
            <input
                type="hidden"
                value={aliasId}
                name={fixedField}
            />
            <Select
                name={chooseField}
                label="Alias"
                options={options.map(a => ({value: a.id, label: a.address}))}
            />
        </Form>
    </div>
}