'use client'
import Form from '@/app/components/Form/Form'
import { createLockerLocationAction } from '@/actions/lockers/location/create'
import TextInput from '@/app/components/UI/TextInput'
import NumberInput from '@/app/components/UI/NumberInput'

export default function CreateLockerLocationForm() {
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
