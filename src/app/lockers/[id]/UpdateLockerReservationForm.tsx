'use client'
import { updateLockerReservationAction } from '@/actions/lockers/reservations/update'
import Form from '@/app/_components/Form/Form'
import { SelectString } from '@/app/_components/UI/Select'
import DateInput from '@/app/_components/UI/DateInput'
import Checkbox from '@/app/_components/UI/Checkbox'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type PropTypes = {
    reservationId: number,
    groupsFormData: {
        value: string,
        label: string
    }[]
}

export default function UpdateLockerReservationForm({ reservationId, groupsFormData }: PropTypes) {
    const { refresh } = useRouter()
    const [indefinateDate, setIndefinateDate] = useState(false)
    const [groupId, setGroupId] = useState('null')

    function handleGroupIdChange(value: string) {
        setGroupId(value)
    }

    return (
        <Form
            successCallback={refresh}
            title="Oppdater skapreservasjon"
            submitText="Oppdater"
            action={updateLockerReservationAction.bind(null, reservationId)}
        >
            <SelectString
                label="Reserver for"
                name="groupId"
                value={groupId}
                options={ [{ value: 'null', label: 'Meg selv' }, ...groupsFormData] }
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
