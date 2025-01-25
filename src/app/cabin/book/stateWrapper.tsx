'use client'

import CabinCalendar from './CabinCalendar'
import RadioLarge from '@/app/_components/UI/RadioLarge'
import Form from '@/app/_components/Form/Form'
import TextInput from '@/app/_components/UI/TextInput'
import NumberInput from '@/app/_components/UI/NumberInput'
import Checkbox from '@/app/_components/UI/Checkbox'
import { useUser } from '@/auth/useUser'
import { createCabinBookinUserAttachedAction } from '@/actions/cabin'
import { getZodDateString } from '@/lib/dates/formatting'
import { useState } from 'react'
import type { BookingFiltered } from '@/services/cabin/booking/Types'
import type { DateRange } from './CabinCalendar'
import type { BookingType } from '@prisma/client'
import Test from './Test'

export default function StateWrapper({
    cabinAvailability,
}: {
    cabinAvailability: BookingFiltered[]
}) {
    const bookingUntil = new Date()
    bookingUntil.setUTCMonth(bookingUntil.getUTCMonth() + 4)

    const [bookingType, setBookingType] = useState<BookingType>('CABIN')
    const [dateRange, setDateRange] = useState<DateRange>({})

    const user = useUser()

    return <>
        <CabinCalendar
            startDate={new Date()}
            bookingUntil={bookingUntil}
            defaultDateRange={dateRange}
            intervalChangeCallback={setDateRange}
            bookings={cabinAvailability}
        />

        <Form
            action={createCabinBookinUserAttachedAction.bind(null, { userId: user.user?.id ?? -1 })}
            submitText="Book hytta"
        >
            <input type="hidden" name="start" value={getZodDateString(dateRange.start) ?? ''} />
            <input type="hidden" name="end" value={getZodDateString(dateRange.end) ?? ''} />

            <RadioLarge
                name="Select type"
                options={[
                    {
                        value: 'CABIN',
                        label: 'Hele hytta',
                    },
                    {
                        value: 'BED',
                        label: 'Enkelt seng'
                    }
                ]}
                defaultValue={bookingType}
                onChange={setBookingType}
            />

            {bookingType === 'BED' && <>
                Bred og god 120 seng eller smal køyeseng???? Her må man kunne velge flere.
            </>}

            <TextInput name="firstname" label="Fornavn" value={user.user?.firstname} disabled={!!user.user} />
            <TextInput name="lastnamee" label="Etternavn" value={user.user?.lastname} disabled={!!user.user} />
            <TextInput name="mobile" label="Telefonnummer" value={user.user?.mobile ?? undefined} disabled={!!user.user} />

            <NumberInput name="memberParticipant" label="Antall som er medlem i Omega" defaultValue={0} />
            <NumberInput name="ExternalParticipant" label="Antall som ikke er medlem i Omega" defaultValue={0} />

            <TextInput name="tenantNotes" label="Notater til utleier" />

            <Checkbox name="acceptedTerms" label="Jeg godtar vilkårene under" />

        </Form>

    </>
}
