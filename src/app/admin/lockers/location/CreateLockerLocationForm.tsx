'use client'
import Form from '@/app/_components/Form/Form'
import { createLockerLocationAction } from '@/actions/lockers/location/create'
import TextInput from '@/app/_components/UI/TextInput'
import NumberInput from '@/app/_components/UI/NumberInput'

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
