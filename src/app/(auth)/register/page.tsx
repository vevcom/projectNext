import { registerUser } from "@/actions/users/create";
import Form from "@/app/components/Form/Form";
import Checkbox from "@/app/components/UI/Checkbox";
import Select from "@/app/components/UI/Select";
import TextInput from "@/app/components/UI/TextInput";
import { requireUser } from "@/auth"
import { redirect } from "next/navigation";

export default function Register() {
    
    requireUser(); // Hmmm, this only throws an error if the user is not logged in. It does not redirect to the login page.

    const sexOptions = [
        {value: "FEMALE", label: "Kvinne"},
        {value: "MALE", label: "Mann"},
        {value: "OTHER", label: "Annet"},
    ]

    return <>
        <Form
            title="Registrer bruker"
            submitText="Registrer bruker"
            action={registerUser}
            successCallback={() => {redirect('/users/me')}}
        >
            <TextInput label="Passord" name="password" />
            <TextInput label="Gjenta passord" name="confirmPassword" />
            <Select name="sex" label="Kjønn" options={sexOptions}/>
            <Checkbox label="Jeg godtar vilkårene" name="acceptTerms" />
        </Form>

    </>
}
