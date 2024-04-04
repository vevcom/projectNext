'use client'
import { useRouter } from 'next/navigation'
import { createLockerReservationAction } from '@/actions/lockers/reservations/create'
import Form from '@/app/components/Form/Form'
import Select from '@/app/components/UI/Select'
import DateInput from '@/app/components/UI/DateInput'
import Checkbox from '@/app/components/UI/Checkbox'
import { useState } from 'react'

type PropTypes = {
    lockerId: number
}

export default function LockerReservationForm({ lockerId }: PropTypes) {
    const { refresh } = useRouter()
    const [indefinateDate, setIndefinateDate] = useState(false)

    return (
        <Form 
            successCallback={refresh}
            title="Reserver skap" 
            submitText="Reserver" 
            action={createLockerReservationAction.bind(null, lockerId)}
        >   
            <Select label="Reserver for" name="committeeId" options={[{value: "-1", label: "Meg selv"}]} />
            <Checkbox label="Reserver på ubestemt tid" name="indefinateDate" onChange={() => setIndefinateDate(!indefinateDate)}/>
            {!indefinateDate && <DateInput label="Reserver fram til" name="endDate"/>}
        </Form>
    )
}