import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";



export default function MailAliasMeta({
    aliasId,
    address,
    description,
}: {
    aliasId: number,
    address: string,
    description: string,
}) {

    return (
        <Form
            submitText="Oppdater"
        >
            <input type="hidden" name="id" value={aliasId} />
            <TextInput name="address" label="Alias" defaultValue={address} />
            <TextInput name="description" label="Beskrivelse" defaultValue={description} />
        </Form>
    )
}