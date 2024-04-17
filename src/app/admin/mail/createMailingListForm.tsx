"use client"
import { createMailingListAction } from "@/actions/mail/list/create";
import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";
import { useRouter } from "next/navigation";

export default function CreateMailingList() {

    const { push } = useRouter();

    return <Form
        title="Opprett ny mail liste"
        submitText="Opprett"
        action={createMailingListAction}
        successCallback={data => {
            if (!data) return;
            push(`./mail/mailingList/${data.id}`)
        }}
    >
        <TextInput label="Navn" name="name"></TextInput>
        <TextInput label="Beskrivelse" name="description"></TextInput>
    </Form>
}