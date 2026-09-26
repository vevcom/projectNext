'use client'
import Form from '@/components/Form/Form'
import { createLockerLocationAction } from '@/services/lockers/actions'
import { lockerLocationAuth } from '@/services/lockers/locations/auth'
import TextInput from '@/components/UI/TextInput'
import NumberInput from '@/components/UI/NumberInput'
import useAuthorizer from '@/hooks/useAuthorizer'

export default function CreateLockerLocationForm() {
    const canCreateLockerLocation = useAuthorizer({ authorizer: lockerLocationAuth.create.dynamicFields({}) })
        .authorized

    if (!canCreateLockerLocation) return null

    return (
        <div>
            <Form
                title="Opprett ny skaplokasjon"
                submitText="Opprett"
                action={createLockerLocationAction}
            >
                <TextInput
                    label="Bygning"
                    name="building"
                />
                <NumberInput
                    label="Etasje"
                    name="floor"
                />
            </Form>
        </div>
    )
}
