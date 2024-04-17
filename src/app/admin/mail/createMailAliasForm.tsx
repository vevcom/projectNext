"use client"

import { createMailAliasAction } from "@/actions/mail/alias/create";
import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";
import { useRouter } from "next/navigation";


export default function CreateMailAlias() {

    const { push } = useRouter();

    return <Form
        title="Opprett nytt alias"
        submitText="Opprett"
        action={createMailAliasAction}
        successCallback={(data) => {
            if (!data) return;
            push(`./mail/alias/${data.id}`)
        }}
    >
        <TextInput label="Alias" name="address" />
        <TextInput label="Beskrivelse" name="description" />
    </Form>
}