'use client'

import { createRoomAction } from '@/actions/cabin'
import Form from '@/app/_components/Form/Form'
import NumberInput from '@/app/_components/UI/NumberInput'
import TextInput from '@/app/_components/UI/TextInput'


export default function CabinRoomForm() {
    const submitAction = createRoomAction.bind(null, {})

    return <Form
        action={submitAction}
    >
        <TextInput name="name" label="Navn" />
        <NumberInput name="capacity" label="Sengeplasser" />
    </Form>
}
