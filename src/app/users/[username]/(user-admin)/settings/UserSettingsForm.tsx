'use client'
import { $Enums, SEX } from '@prisma/client'
import Form from '@/components/Form/Form'
import Checkbox from '@/components/UI/Checkbox'
import TextInput from '@/components/UI/TextInput'
import { SelectString } from '@/components/UI/Select'
import { useState } from 'react'
import { configureAction } from '@/services/configureAction'
import { updateUserAction } from '@/services/users/actions'
import { sexConfig } from '@/services/users/constants'
import Textarea from '@/components/UI/Textarea'



export type UserDataType = {
    userData: {
        username: string,
        mobile: string | null,
        allergies: string | null,
        email:string,
        sex: $Enums.SEX | null,
        firstname:string,
        lastname:string,
        bio:string
    }
}


export default function UserSettingsForm({ userData } : UserDataType) {
    const [sexValue, setSexValue] = useState<SEX | undefined>(userData.sex ?? undefined)
    
    const sexOptions = Object.values(SEX).map(sex => ({
        value: sex,
        label: sexConfig[sex].label
    }))

    return (
        <Form
            title="Brukerinnstillinger"
            submitText="Lagre"
            action={configureAction(updateUserAction, { params: { username: userData.username } })}
            >
                <TextInput label="Fornavn" name="firstname" defaultValue={userData.firstname || ''} />
                <TextInput label="Etternavn" name="lastname" defaultValue={userData.lastname || ''} />
                <TextInput label="Telefonnummer" name="mobile" defaultValue={userData.mobile || ''} />
                <TextInput label="Allergier / diett" name="allergies" defaultValue={userData.allergies || ''} />
                <TextInput label="Email" name="email" defaultValue={userData.email || ''} />
                <SelectString
                            label="Kjønn"
                            name="sex"
                            options={sexOptions}
                            value={sexValue}
                            onChange={(e) => setSexValue(e as SEX)} />
                <Textarea label="bio" name="bio" defaultValue={userData.bio} />
                <Checkbox label="Jeg samtykker til å bli tatt bilde av" name="imageConsent" />
            </Form>
        );
}