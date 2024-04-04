'use client'
import { useRouter } from 'next/navigation'
import { updateLockerReservationAction } from '@/actions/lockers/reservations/update'
import Form from '@/app/components/Form/Form'
import Select from '@/app/components/UI/Select'
import DateInput from '@/app/components/UI/DateInput'
import Checkbox from '@/app/components/UI/Checkbox'
import { useState } from 'react'

type PropTypes = {
    reservationId: number
}

export default function UpdateLockerReservationForm({ reservationId }: PropTypes) {
    const { refresh } = useRouter()
    const [indefinateDate, setIndefinateDate] = useState(false)

    return (
        <Form 
            successCallback={refresh}
            title="Oppdater skapreservasjon" 
            submitText="Oppdater" 
            action={updateLockerReservationAction.bind(null, reservationId)}
        >   
            <Select label="Reserver for" name="committeeId" options={[{value: "-1", label: "Meg selv"}]} />
            <Checkbox label="Reserver på ubestemt tid" name="indefinateDate" onChange={() => setIndefinateDate(!indefinateDate)}/>
            {!indefinateDate && <DateInput label="Reserver fram til" name="endDate"/>}
        </Form>
    )
}