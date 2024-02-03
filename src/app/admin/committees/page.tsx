import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";
import create from "@/actions/committees/create";

export default function adminCommittee () {
    return <Form action={create.bind()}>
        <TextInput name="name" label="Navn"/>
    </Form>
}
