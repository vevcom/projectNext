'use client'
import { configureAction } from '@/actions/configureAction'
import { registerUser } from '@/actions/users/update'
import Form from '@/components/Form/Form'
import Checkbox from '@/components/UI/Checkbox'
import { SelectString } from '@/components/UI/Select'
import TextInput from '@/components/UI/TextInput'
import { UserConfig } from '@/services/users/config'
import { SEX, type User } from '@prisma/client'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function RegistrationForm({
    userData,
}: {
    userData: Pick<User, 'id' | 'username' | 'mobile' | 'allergies' | 'sex'>,
}) {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/users/me'

    const [lastPassword, setLastPassword] = useState('')

    const sexOptions = Object.values(SEX).map(sex => ({
        value: sex,
        label: UserConfig.sexConfig[sex].label
    }))

    return <Form
        title="Ekstra brukerinformasjon"
        submitText="Fullfør registrering"
        action={configureAction(registerUser, { params: { id: userData.id } })}
        successCallback={() => signIn('credentials', {
            username: userData.username,
            password: lastPassword,
            redirect: true,
            callbackUrl
        })}
    >
        <TextInput label="Telefonnummer" name="mobile" defaultValue={userData.mobile ?? ''} />
        <TextInput label="Allergier / diett" name="allergies" defaultValue={userData.allergies ?? ''} />
        <TextInput type="password" label="Passord" name="password" onChange={(e) => { setLastPassword(e.target.value) }} />
        <TextInput type="password" label="Gjenta passord" name="confirmPassword" />
        <SelectString label="Kjønn" name="sex" options={sexOptions} defaultValue={userData.sex ?? undefined} />
        <Checkbox label="Jeg godtar vilkårene" name="acceptedTerms" />
    </Form>
}
