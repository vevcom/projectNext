import { registerUser } from "@/actions/users/create";
import Form from "@/app/components/Form/Form";
import Checkbox from "@/app/components/UI/Checkbox";
import TextInput from "@/app/components/UI/TextInput";
import { requireUser } from "@/auth"

export default function Register() {
    
    requireUser(); // Hmmm, this only throws an error if the user is not logged in. It does not redirect to the login page.

    return <>
        <Form
            title="Registrer bruker"
            submitText="Registrer bruker"
            action={registerUser}
        >
            <TextInput label="Passord" name="password" />
            <TextInput label="Gjenta passord" name="confirmPassword" />
            <Checkbox label="Jeg godtar vilkårene" name="acceptTerms" />
        </Form>

    </>
}
