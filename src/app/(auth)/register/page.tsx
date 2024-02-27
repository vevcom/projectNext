'use client'
import { registerUser } from "@/actions/users/create";
import Form from "@/app/components/Form/Form";
import Checkbox from "@/app/components/UI/Checkbox";
import Select from "@/app/components/UI/Select";
import TextInput from "@/app/components/UI/TextInput";
import { requireUser } from "@/auth"
import { useUser } from "@/auth/client";
import { signIn } from "next-auth/react";
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

    let lastUsername = userAuth.user?.username;
    let lastPassword : string = '';

    function callback() {
        
        signIn('credentials', {
            username: lastUsername,
            password: lastPassword,
            redirect: true,
            callbackUrl: searchParams.get('callbackUrl') || '/users/me'
        })

        redirect(callbackUrl ?? "users/me")
    }

    return <Form
        title="Registrer bruker"
        submitText="Registrer bruker"
        action={registerUser}
        successCallback={callback}
    >
        <TextInput label="Brukernavn" name="username" disabled={true} value={userAuth.user?.username}/>
        <TextInput label="Epost" name="email" disabled={true} value={userAuth.user?.email}/>
        <TextInput label="Passord" name="password" onChange={(e) => lastPassword = e.target.value}/>
        <TextInput label="Gjenta passord" name="confirmPassword" />
        <Select name="sex" label="Kjønn" options={sexOptions}/>
        <Checkbox label="Jeg godtar vilkårene" name="acceptTerms" />
    </Form>
}
