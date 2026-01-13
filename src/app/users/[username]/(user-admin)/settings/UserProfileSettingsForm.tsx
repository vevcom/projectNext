'use client'
import Form from '@/components/Form/Form'
import Checkbox from '@/components/UI/Checkbox'
import TextInput from '@/components/UI/TextInput'
import { SelectConstructor } from '@/components/UI/Select'
import { configureAction } from '@/services/configureAction'
import { updateUserProfileAction } from '@/services/users/actions'
import { sexConfig, relationshipStatusConfig } from '@/services/users/constants'
import Textarea from '@/components/UI/Textarea'
import { RelationshipStatus, SEX } from '@/prisma-generated-pn-types'
import type { UserFiltered } from '@/services/users/types'

const SeclectRelationshipStatus = SelectConstructor<RelationshipStatus>(
    value => Object.values(RelationshipStatus).find(status => status === value) ?? RelationshipStatus.NOT_SPECIFIED
)

const SelectSex = SelectConstructor<SEX>(
    value => Object.values(SEX).find(sex => sex === value) ?? SEX.OTHER
)

type PropTypes = {
    user: UserFiltered
}

export default function UserProfileSettingsForm({ user } : PropTypes) {
    const sexOptions = Object.values(SEX).map(sex => ({
        value: sex,
        label: sexConfig[sex].label
    }))

    const relationshipOptions = Object.values(RelationshipStatus).map(relationshipStatus => ({
        value: relationshipStatus,
        label: relationshipStatusConfig[relationshipStatus].label
    }))

    console.log('user in form', user)

    return (
        <Form
            title="Profilinnstillinger"
            submitText="Lagre"
            action={configureAction(updateUserProfileAction, { params: { username: user.username } })}
        >
            <p>Har du andre brukerinstillinger du ønsker å endre? Kontakt HS på hs@omega.ntnu.no</p>
            <TextInput label="Allergier / diett" name="allergies" defaultValue={user.allergies || ''} />
            <SelectSex
                label="Kjønn"
                name="sex"
                options={sexOptions}
                defaultValue={user.sex ?? SEX.OTHER}
            />
            <Textarea label="bio" name="bio" defaultValue={user.bio} />
            <TextInput
                label="Sivilstatus"
                name="relationshipStatusText"
                defaultValue={user.relationshipStatusText || ''}
            />
            <SeclectRelationshipStatus
                label="Sivilstatus"
                name="relationshipStatus"
                options={relationshipOptions}
                defaultValue={user.relationshipStatus}
            />
            <Checkbox
                label="Jeg samtykker til å bli tatt bilde av"
                name="imageConsent"
                defaultChecked={user.imageConsent} />
        </Form>
    )
}
