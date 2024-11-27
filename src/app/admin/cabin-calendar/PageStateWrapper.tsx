'use client'
import styles from './page.module.scss'
import BookingPeriodForm from './BookingPeriodForm'
import { ReleaseGroups } from './ReleaseGroups'
import CabinCalendar from '@/app/_components/cabinCalendar/CabinCalendar'
import PopUp from '@/app/_components/PopUp/PopUp'
import { displayDate } from '@/lib/dates/displayDate'
import Checkbox from '@/app/_components/UI/Checkbox'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readReleaseGroupAction, updateReleaseGroupBookingPeriodsAction } from '@/actions/cabin'
import Form from '@/app/_components/Form/Form'
import Button from '@/app/_components/UI/Button'
import { v4 as uuid } from 'uuid'
import { useState } from 'react'
import type { BookingPeriod, ReleaseGroup } from '@prisma/client'


export default function PageStateWrapper({
    bookingPeriods,
    releaseGroups
}: {
    bookingPeriods: BookingPeriod[],
    releaseGroups: (ReleaseGroup & {
        bookingPeriods: BookingPeriod[]
    })[]
}) {
    const [selectedReleaseGroup, setSelectedReleaseGroup] = useState<number | undefined>()
    const [selectedBookingPeriods, setSelectedBookingPeriods] = useState<number[]>([])

    return <>

        <CabinCalendar date={new Date()} bookingPeriods={bookingPeriods} />

        <PopUp
            PopUpKey="CreateBookingPeriod"
            showButtonContent="Ny Booking Periode"
            showButtonClass={styles.button}
        >
            <BookingPeriodForm />
        </PopUp>

        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Type</th>
                    {selectedReleaseGroup !== undefined && <th>Velg</th>}
                    <th>Startdato</th>
                    <th>Sluttdato</th>
                    <th>Notater</th>
                </tr>
            </thead>
            <tbody>
                {bookingPeriods.map(bookingPeriod => <tr key={uuid()}>
                    <td>{bookingPeriod.type}</td>
                    {selectedReleaseGroup !== undefined && <td>
                        <Checkbox
                            checked={selectedBookingPeriods.includes(bookingPeriod.id)}
                            onClick={() => {
                                if (selectedBookingPeriods.includes(bookingPeriod.id)) {
                                    setSelectedBookingPeriods(selectedBookingPeriods
                                        .filter(val => val !== bookingPeriod.id)
                                    )
                                } else {
                                    setSelectedBookingPeriods(selectedBookingPeriods.concat(bookingPeriod.id))
                                }
                            }}
                        />
                    </td>}
                    <td>{displayDate(bookingPeriod.start, false)}</td>
                    <td>{displayDate(bookingPeriod.end, false)}</td>
                    <td>{bookingPeriod.notes}</td>
                </tr>)}
            </tbody>
        </table>

        <ReleaseGroups
            releaseGroups={releaseGroups}
            selectedGroupId={selectedReleaseGroup}
            selectCallBack={async (group, state) => {
                if (!state) {
                    setSelectedReleaseGroup(undefined)
                    return
                }
                setSelectedReleaseGroup(group.id)
                const connectedPeriods = unwrapActionReturn(await readReleaseGroupAction({ id: group.id }))
                setSelectedBookingPeriods(connectedPeriods.bookingPeriods.map(period => period.id))
            }}
        />

        {selectedReleaseGroup !== undefined &&
            <Button
                onClick={async () => {
                    await updateReleaseGroupBookingPeriodsAction({
                        releaseId: selectedReleaseGroup,
                        bookingPeriodIds: selectedBookingPeriods,
                    })
                }}
            >
                Koble booking perioder
            </Button>
        }
    </>
}
