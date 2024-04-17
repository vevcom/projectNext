"use client"

import TextInput from "@/app/components/UI/TextInput";
import Form from "@/app/components/Form/Form";
import { MailFlowObject } from "@/server/mail/Types";
import Select from "@/app/components/UI/Select";



export default function EditMailAlias({
    id,
    data,
}: {
    id: number,
    data: MailFlowObject,
}) {

    const focuesAlias = data.alias[0];
    if (!focuesAlias) {
        throw Error("Could not find alias");
    }

    return <>
        <div>
            <Form
                title="Metadata"
                submitText="Oppdater"
            >
                <TextInput name="address" label="Epost" defaultValue={focuesAlias.address}/>
            </Form>
        </div>
        <div>
            <Form
                title="Legg til mailliste"
                submitText="Legg til"
            >
                <Select options={[]} name="mailingList" label="Mailliste"/>
            </Form>
        </div>
    </>
}