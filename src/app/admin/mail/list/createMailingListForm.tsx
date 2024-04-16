import { createMailingListAction } from "@/actions/mail/list/create";
import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";


export default function CreateMailingList() {

    return <Form
        title="Opprett ny mail liste"
        submitText="Opprett"
        action={createMailingListAction}
    >
        <TextInput label="Navn" name="name"></TextInput>
        <TextInput label="Beskrivelse" name="description"></TextInput>
    </Form>
}