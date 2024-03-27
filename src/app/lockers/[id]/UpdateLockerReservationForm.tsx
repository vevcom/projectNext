'use client'
import { useRouter } from 'next/navigation'
import { updateLockerReservationAction } from '@/actions/lockers/reservations/update'
import Form from '@/app/components/Form/Form'
import Select from '@/app/components/UI/Select'
import DateInput from '@/app/components/UI/DateInput'

type PropTypes = {
    reservationId: number
}

export default function UpdateLockerReservationForm({ reservationId }: PropTypes) {
    const { refresh } = useRouter()

    return (
        <Form 
            successCallback={refresh}
            title="Oppdater skapreservasjon" 
            submitText="Oppdater" 
            action={updateLockerReservationAction.bind(null, reservationId)}
        >   
            <Select label="Reserver for" name="committeeId" options={[{value: "-1", label: "Meg selv"}]} />
            <DateInput label="date" name="endDate"/>
        </Form>
    )
}