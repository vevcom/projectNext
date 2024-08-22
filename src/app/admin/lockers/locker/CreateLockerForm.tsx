'use client'
import Form from '@/app/components/Form/Form'
import Select from '@/app/components/UI/Select'
import NumberInput from '@/app/components/UI/NumberInput'
import { createLockerAction } from '@/actions/lockers/create'
import { useState } from 'react'

type PropTypes = {
    locations: {
        building: string,
        floor: number
    }[]
}

export default function CreateLockerForm({ locations }: PropTypes) {
    const [currentBuilding, setCurrentBuilding] = useState(locations[0].building)

    const buildingMap = new Map<string, number[]>()
    locations.forEach(location => {
        if (buildingMap.has(location.building)) {
            buildingMap.get(location.building)?.push(location.floor)
        } else {
            buildingMap.set(location.building, [location.floor])
        }
    })

    const handleBuildingChange = (value: string) => {
        setCurrentBuilding(value)
    }

    const buildingOptions = Array.from(buildingMap.keys()).map(building => ({ value: building, label: building }))

    function getFloors(building: string): { value: string; label: string; }[] {
        return buildingMap.get(building)?.sort().map(floor => ({ value: floor.toString(), label: floor.toString() })) ?? []
    }

    return (
        <Form
            title="Opprett nytt skap"
            submitText="Opprett"
            action={createLockerAction}
        >

            <Select
                label="Bygning"
                name="building"
                onChange={handleBuildingChange}
                options={buildingOptions}
            />

            <Select
                label="Etasje"
                name="floor"
                options={getFloors(currentBuilding)}
            />

            <NumberInput
                label="Skapnummer"
                name="id"
                min="0"
            />
        </Form>
    )
}
