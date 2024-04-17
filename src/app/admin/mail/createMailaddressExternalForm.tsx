import { createMailAddressExternalAction } from "@/actions/mail/mailAddressExternal/create";
import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";



export default function CreateMailaddressExternal() {

    return <Form
        title="Opprett ny ekstern adresse"
        submitText="Opprett"
        action={createMailAddressExternalAction}
    >
        <TextInput label="Adresse" name="address"></TextInput>
        <TextInput label="Beskrivelse" name="description"></TextInput>
    </Form>
}