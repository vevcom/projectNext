import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";
import create from "@/actions/groups/committees/create";

export default function adminCommittee() {
    return (
        <Form action={create.bind(null, 1)}>
            <TextInput name="name" label="Navn"/>
        </Form>
    )
}
