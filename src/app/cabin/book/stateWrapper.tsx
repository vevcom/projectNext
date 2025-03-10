'use client'

import CabinCalendar from './CabinCalendar'
import CabinPriceCalculator from './CabinPriceCalculator'
import RadioLarge from '@/app/_components/UI/RadioLarge'
import Form from '@/app/_components/Form/Form'
import TextInput from '@/app/_components/UI/TextInput'
import NumberInput from '@/app/_components/UI/NumberInput'
import Checkbox from '@/app/_components/UI/Checkbox'
import { useUser } from '@/auth/useUser'
import { createCabinBookinUserAttachedAction } from '@/actions/cabin'
import { getZodDateString } from '@/lib/dates/formatting'
import { useMemo, useState } from 'react'
import type { CabinProductConfig } from '@/services/cabin/product/config'
import type { BookingFiltered } from '@/services/cabin/booking/Types'
import type { DateRange } from './CabinCalendar'
import type { BookingType } from '@prisma/client'
import SelectCabinProduct from './SelectCabinProduct'

export default function StateWrapper({
    cabinAvailability,
    releaseUntil,
    cabinProducts,
}: {
    cabinAvailability: BookingFiltered[],
    releaseUntil: Date,
    cabinProducts: CabinProductConfig.CabinProductExtended[],
}) {
    const bookingUntil = new Date()
    bookingUntil.setUTCMonth(bookingUntil.getUTCMonth() + 4)

    const [bookingType, setBookingType] = useState<BookingType>('CABIN')
    const [dateRange, setDateRange] = useState<DateRange>({})
    const [selectedProduct, setSelectedProduct] = useState<CabinProductConfig.CabinProductExtended | undefined>()

    const [numberOfMembers, setNumberOfMembers] = useState(0)
    const [numberOfNonMembers, setNumberOfNonMembers] = useState(0)

    const user = useUser()

    const calendar = useMemo(() => (
        <CabinCalendar
            startDate={new Date()}
            bookingUntil={releaseUntil}
            defaultDateRange={dateRange}
            intervalChangeCallback={setDateRange}
            bookings={cabinAvailability}
        />
    ), [cabinAvailability, releaseUntil, dateRange])

    const priceCalculator = useMemo(() => (
        <CabinPriceCalculator
            product={selectedProduct}
            startDate={dateRange.start}
            endDate={dateRange.end}
            numberOfMembers={numberOfMembers}
            numberOfNonMembers={numberOfNonMembers}
        />
    ), [selectedProduct, dateRange, numberOfMembers, numberOfNonMembers])

    return <>
        { calendar }

        <Form
            action={createCabinBookinUserAttachedAction.bind(null, { userId: user.user?.id ?? -1 })}
            submitText="Book hytta"
        >
            <input type="hidden" name="start" value={getZodDateString(dateRange.start) ?? ''} readOnly />
            <input type="hidden" name="end" value={getZodDateString(dateRange.end) ?? ''} readOnly />
            <input type="hidden" name="type" value={bookingType} readOnly />

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
                value={bookingType}
                onChange={(newType) => {
                    setBookingType(newType)
                    const newProduct = cabinProducts.find(product => product.type === newType)
                    if (newProduct) {
                        setSelectedProduct(newProduct)
                    }
                }}
            />

            <SelectCabinProduct
                type={bookingType}
                value={selectedProduct}
                cabinProducts={cabinProducts}
                onChange={setSelectedProduct}
            />

            { priceCalculator }

            <TextInput
                name="firstname"
                label="Fornavn"
                defaultValue={user.user?.firstname ?? ''}
                disabled={!!user.user}
                readOnly={!!user.user}
            />
            <TextInput
                name="lastname"
                label="Etternavn"
                defaultValue={user.user?.lastname ?? ''}
                disabled={!!user.user}
                readOnly={!!user.user}
            />
            <TextInput
                name="mobile"
                label="Telefonnummer"
                defaultValue={user.user?.mobile ?? ''}
                disabled={!!user.user}
                readOnly={!!user.user}
            />

            <NumberInput
                name="memberParticipant"
                label="Antall som er medlem i Omega"
                value={numberOfMembers}
                onChange={(e) => {
                    const value = Number(e.target.value)
                    if (value >= 0) {
                        setNumberOfMembers(value)
                    }
                }}
            />
            <NumberInput
                name="ExternalParticipant"
                label="Antall som ikke er medlem i Omega"
                value={numberOfNonMembers}
                onChange={(e) => {
                    const value = Number(e.target.value)
                    if (value >= 0) {
                        setNumberOfNonMembers(value)
                    }
                }}
            />

            <TextInput name="tenantNotes" label="Notater til utleier" />

            <Checkbox name="acceptedTerms" label="Jeg godtar vilkårene under" />

        </Form>

    </>
}
