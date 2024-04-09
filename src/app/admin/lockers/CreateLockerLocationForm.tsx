'use client'
import Form from '@/app/components/Form/Form'
import Select from '@/app/components/UI/Select'
import { createLockerAction } from "@/actions/lockers/create"

type PropTypes = {
    locations: {
        building: string,
        floor: number
    }[]
}

export default function CreateLockerForm({ locations }: PropTypes) {
    return (
        <Form 
            title="Opprett ny skaplokasjon" 
            submitText="Opprett" 
            action={createLockerAction}
        >   
            <Select label="Bygning" name="location" options={locations.map(location => ({value: location.building, label: `${location.building} ${location.floor}. Etasje`}))} />
        </Form>
    )
}