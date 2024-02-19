'use client'
import TextInput from '@/UI/TextInput'
import read from '@/actions/studyprograms/read'
import { registerOwnUser } from '@/actions/users/update'
import Form from '@/app/components/Form/Form'
import { useUser } from '@/auth/client'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import Checkbox from '@/app/components/UI/Checkbox'

export default function Register() {

    const user = useUser();

    if (user.status !== 'authenticated' || !user.user) {
        redirect('/login');
    }

    const [studyProgram, setStudyProgram] = useState("Ingen studieprogram registrert.");

    console.log(user);

    (async () => {
        if (user.user?.studyProgramId) {
            const response = await read(user.user.studyProgramId);
            console.log(response);
            if (response.success) {
                setStudyProgram(response.data.name);
            }
        }
    })();

    return <>
        <h2>Registrer bruker</h2>
        <ul>
            <li>Navn: {user.user.firstname} {user.user.lastname}</li>
            <li>Brukernavn: {user.user.username}</li>
            <li>Studieprogram: {studyProgram}</li>
            <li>Epost: {user.user.email}</li>
        </ul>
        <Form
            action={registerOwnUser}
            submitText="Registrer"
            successCallback={() => redirect('/users/me')}
        >
            <TextInput name="yearOfStudy" label="Trinn" type="text" defaultValue={1}/>
            <TextInput name="password" label="Passord" type="password" />
            <Checkbox name="acceptedTerms" label="Jeg aksepterer vilkår for bruk av dine data. Les mer her" />
        </Form>
    </>
}
