'use client'
import { registerUser } from "@/actions/users/create";
import Form from "@/app/components/Form/Form";
import Checkbox from "@/app/components/UI/Checkbox";
import Select from "@/app/components/UI/Select";
import TextInput from "@/app/components/UI/TextInput";
import { requireUser } from "@/auth"
import { useUser } from "@/auth/client";
import { redirect, useSearchParams } from "next/navigation";

export default async function Register() {
    
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    const userAuth = useUser()
    if (userAuth.status !== 'authenticated') {
        redirect('/login')
    }
    
    const sexOptions = [
        {value: "FEMALE", label: "Kvinne"},
        {value: "MALE", label: "Mann"},
        {value: "OTHER", label: "Annet"},
    ]

    return <Form
        title="Registrer bruker"
        submitText="Registrer bruker"
        action={registerUser}
        successCallback={() => redirect('/login' + (callbackUrl ? `?callbackUrl=${callbackUrl}` : ''))}
    >
        <TextInput label="Brukernavn" name="username" disabled={true} value={userAuth.user?.username}/>
        <TextInput label="Epost" name="email" disabled={true} value={userAuth.user?.email}/>
        <TextInput label="Passord" name="password" />
        <TextInput label="Gjenta passord" name="confirmPassword" />
        <Select name="sex" label="Kjønn" options={sexOptions}/>
        <Checkbox label="Jeg godtar vilkårene" name="acceptTerms" />
    </Form>
}
