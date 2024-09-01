'use client'
import { createLockerReservationAction } from '@/actions/lockers/reservations/create'
import Form from '@/app/_components/Form/Form'
import { SelectString } from '@/app/_components/UI/Select'
import DateInput from '@/app/_components/UI/DateInput'
import Checkbox from '@/app/_components/UI/Checkbox'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    const [groupId, setGroupId] = useState('-1')

    function handleGroupIdChange(value: string) {
        setGroupId(value)
    }

    return (
        <Form
            successCallback={refresh}
            title="Reserver skap"
            submitText="Reserver"
            action={createLockerReservationAction.bind(null, lockerId)}
        >
            <SelectString
                label="Reserver for"
                name="groupId"
                value={groupId}
                options={ [{ value: '-1', label: 'Meg selv' }, ...groupsFormData] }
                onChange={handleGroupIdChange}
            />
            <Checkbox
                label="Reserver på ubestemt tid"
                name="indefinateDate"
                onChange={() => setIndefinateDate(!indefinateDate)}
            />
            { !indefinateDate && <DateInput label="Reserver fram til" name="endDate"/> }
        </Form>
    )
}
