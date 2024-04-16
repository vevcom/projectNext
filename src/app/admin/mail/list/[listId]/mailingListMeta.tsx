import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";

export default function MailingListMeta({
    mailingListId,
    name,
    description,
}: {
    mailingListId: number,
    name: string,
    description: string,
}) {

    return <div>
        <Form
            submitText="Oppdater"
        >
            <input type="hidden" name="id" value={mailingListId} />
            <TextInput name="name" label="Navn" defaultValue={name} />
            <TextInput name="description" label="Beskrivelse" defaultValue={description} />
        </Form>
    </div>
}