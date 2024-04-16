import { createMailAliasAction } from "@/actions/mail/alias/create";
import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";


export default function CreateMailAlias() {

    return <Form
        title="Opprett nytt alias"
        submitText="Opprett"
        action={createMailAliasAction}
    >
        <TextInput label="Alias" name="address"></TextInput>
    </Form>
}