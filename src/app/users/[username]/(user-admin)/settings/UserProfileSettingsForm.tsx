'use client'
import Form from '@/components/Form/Form'
import Checkbox from '@/components/UI/Checkbox'
import TextInput from '@/components/UI/TextInput'
import { SelectString } from '@/components/UI/Select'
import { configureAction } from '@/services/configureAction'
import { updateUserProfileAction } from '@/services/users/actions'
import { sexConfig } from '@/services/users/constants'
import Textarea from '@/components/UI/Textarea'
import { SEX } from '@prisma/client'
import { useState } from 'react'
import type { $Enums } from '@prisma/client'


export type UserDataType = {
    userData: {
        username: string,
        mobile: string | null,
        allergies: string | null,
        email:string,
        sex: $Enums.SEX | null,
        firstname:string,
        lastname:string,
        bio:string,
        imageConsent:boolean
    }
}


export default function UserProfileSettingsForm({ userData } : UserDataType) {
    const [sexValue, setSexValue] = useState<SEX | undefined>(userData.sex ?? undefined)

    const sexOptions = Object.values(SEX).map(sex => ({
        value: sex,
        label: sexConfig[sex].label
    }))
    return (
        <Form
            title="Profilinnstillinger"
            submitText="Lagre"
            action={configureAction(updateUserProfileAction, { params: { username: userData.username } })}
        >
            <p>Har du andre brukerinstillinger du ønsker å endre? Kontakt HS på hs@omega.ntnu.no</p>
            <TextInput label="Allergier / diett" name="allergies" defaultValue={userData.allergies || ''} />
            <SelectString
                label="Kjønn"
                name="sex"
                options={sexOptions}
                value={sexValue}
                onChange={(e) => setSexValue(e as SEX)} />
            <Textarea label="bio" name="bio" defaultValue={userData.bio} />
            <Checkbox
                label="Jeg samtykker til å bli tatt bilde av"
                name="imageConsent"
                defaultChecked={userData.imageConsent} />
        </Form>
    )
}
