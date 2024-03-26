'use client'
import { useRouter } from 'next/navigation'
import { createLockerReservationAction } from '@/actions/lockers/reservations/create'
import Form from '@/app/components/Form/Form'
import Select from '@/app/components/UI/Select'
import NumberInput from '@/app/components/UI/NumberInput'
import DateInput from '@/app/components/UI/DateInput'

type PropTypes = {
    lockerId: string
}

export default function LockerReservationForm({ lockerId }: PropTypes) {
    const { refresh } = useRouter()

    return (
        <Form 
            successCallback={refresh}
            title="Reserver skap" 
            submitText="Reserver" 
            action={createLockerReservationAction}
        >   
            <NumberInput label="lockerId" name="lockerId" defaultValue={lockerId} hidden={true} />  
            <Select label="Reserver for" name="committeeId" options={[{value: "-1", label: "Meg selv"}]} />
            <DateInput label="date" name="endDate"/>
        </Form>
    )
}