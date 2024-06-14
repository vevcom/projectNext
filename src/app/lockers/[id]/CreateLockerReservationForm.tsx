'use client'
import { useRouter } from 'next/navigation'
import { createLockerReservationAction } from '@/actions/lockers/reservations/create'
import Form from '@/app/components/Form/Form'
import Select from '@/app/components/UI/Select'
import DateInput from '@/app/components/UI/DateInput'
import Checkbox from '@/app/components/UI/Checkbox'
import React, { useState } from 'react'

type PropTypes = {
    lockerId: number
    groupsFormData: {
        value: string,
        label: string
    }[]
}

export default function LockerReservationForm({ lockerId, groupsFormData }: PropTypes) {
    const { refresh } = useRouter()
    const [indefinateDate, setIndefinateDate] = useState(false)
    const [groupId, setGroupId] = useState("-1") // State on groupId is used to prevent form from resetting when indefinateDate is toggled

    function handleGroupIdChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setGroupId(event.target.value)
    }

    return (
        <Form
            successCallback={refresh}
            title="Reserver skap" 
            submitText="Reserver" 
            action={createLockerReservationAction.bind(null, lockerId)}
        >   
            <Select
                label="Reserver for"
                name="groupId"
                value={groupId}
                options={[{value: "-1", label: "Meg selv"}, ...groupsFormData]}
                onChange={handleGroupIdChange}
            />
            <Checkbox
                label="Reserver på ubestemt tid"
                name="indefinateDate"
                onChange={() => setIndefinateDate(!indefinateDate)}
            />
            {!indefinateDate && <DateInput label="Reserver fram til" name="endDate"/>}
        </Form>
    )
}
