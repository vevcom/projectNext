'use client'
import Form from '@/app/components/Form/Form'
import Select from '@/app/components/UI/Select'
import { createLockerAction } from "@/actions/lockers/create"
import { useState } from 'react'
import NumberInput from '@/app/components/UI/NumberInput'

type PropTypes = {
    locations: {
        building: string,
        floor: number
    }[]
}

export default function CreateLockerForm({ locations }: PropTypes) {
    const [building, setBuilding] = useState(locations[0].building)

    const buildingMap = new Map<string, number[]>()
    locations.forEach(location => {
        if (buildingMap.has(location.building)) {
            buildingMap.get(location.building)?.push(location.floor)
        }     
        else {
            buildingMap.set(location.building, [location.floor])
        }
    })

    const handleBuildingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBuilding(event.target.value)
    }

    return (
        <Form 
            title="Opprett nytt skap" 
            submitText="Opprett" 
            action={createLockerAction}
        >   
 
            <Select label="Bygning" name="building" onChange={handleBuildingChange} options={Array.from(buildingMap.keys()).map(building => ({value: building, label: building}))} />
            <Select label="Etasje" name="floor" options={buildingMap.get(building)?.sort().map(floor => ({value: floor.toString(), label: floor.toString()})) ?? []}/>
            <NumberInput label="Skapnummer" name="id" min="0"/>
        </Form>
    )
}
