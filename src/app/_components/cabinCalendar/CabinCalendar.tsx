'use client'
import styles from './CabinCalendar.module.scss'
import { dateLessThan, datesEqual, getWeekNumber } from '@/lib/dates/comparison'
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Record } from '@prisma/client/runtime/library'
import type { BookingPeriodType, BookingPeriod } from '@prisma/client'

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']

enum Selection {
    'START',
    'END',
    'INRANGE'
}

type Marker = BookingPeriod & {
    selection: Selection,
}

type Day = {
    correctMonth: boolean,
    date: Date,
    selection?: Selection,
    markers: Marker[]
}

type Week = {
    days: Day[],
    number: number,
}

type DateRange = {
    start?: Date,
    end?: Date,
}

function getMarkers(date: Date, bookingPeriods: BookingPeriod[]): Marker[] {
    const ret: Marker[] = []

    for (const period of bookingPeriods) {
        if (datesEqual(date, period.start)) {
            ret.push({
                ...period,
                selection: Selection.START,
            })
        } else if (datesEqual(date, period.end)) {
            ret.push({
                ...period,
                selection: Selection.END,
            })
        } else if (dateLessThan(period.start, date) && dateLessThan(date, period.end)) {
            ret.push({
                ...period,
                selection: Selection.INRANGE,
            })
        }
    }

    return ret
}

function generateCalendarData(date: Date, dateRange: DateRange, bookingPeriods: BookingPeriod[] = []): Week[] {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)

    const firstDayOfFirstWeek = new Date(date)
    const firstDayOfFirstWeekOffset = firstDayOfMonth.getDate() - firstDayOfMonth.getDay() + 1
    firstDayOfFirstWeek.setDate(firstDayOfFirstWeekOffset)

    const currentMonth = date.getMonth()

    const ret: Week[] = []
    const daysArray = Array.from({ length: 7 })

    for (let i = 0; i < 5; i++) {
        const mondayDate = new Date(firstDayOfFirstWeek)
        mondayDate.setDate(mondayDate.getDate() + 7 * i)
        ret.push({
            number: getWeekNumber(mondayDate),
            days: daysArray.map((_, j) => {
                const thisDate = new Date(firstDayOfFirstWeek)
                thisDate.setDate(thisDate.getDate() + i * 7 + j)

                let selection: undefined | Selection = undefined

                if (datesEqual(thisDate, dateRange.start)) {
                    selection = Selection.START
                } else if (datesEqual(thisDate, dateRange.end)) {
                    selection = Selection.END
                } else if (dateRange.start && dateRange.end) {
                    const inRange = dateRange && dateRange.start <= thisDate && thisDate < dateRange.end

                    if (inRange) {
                        selection = Selection.INRANGE
                    }
                }

                return {
                    correctMonth: currentMonth === thisDate.getMonth(),
                    date: thisDate,
                    selection,
                    markers: getMarkers(thisDate, bookingPeriods)
                }
            })
        })
    }


    return ret
}

export default function CabinCalendar({
    date,
    bookingPeriods,
}: {
    date: Date,
    bookingPeriods?: BookingPeriod[],
}) {
    const [dateRange, setDateRange] = useState<DateRange>({})
    const [lastChangeWasStart, setLastChangeWasStart] = useState(false)
    const [weeks, setWeeks] = useState(generateCalendarData(date, dateRange, bookingPeriods))

    function callback(day: Day) {
        if (datesEqual(day.date, dateRange.start) || datesEqual(day.date, dateRange.end)) return

        let newDateRange: DateRange = {}
        let shouldChangeStart = !lastChangeWasStart
        if (dateRange.start && day.date < dateRange.start) shouldChangeStart = true
        if (dateRange.end && day.date > dateRange.end) shouldChangeStart = false

        if (shouldChangeStart) {
            newDateRange = {
                start: day.date,
                end: dateRange.end
            }
        } else {
            newDateRange = {
                start: dateRange.start,
                end: day.date,
            }
        }
        setDateRange(newDateRange)
        setLastChangeWasStart(shouldChangeStart)
        setWeeks(generateCalendarData(date, newDateRange, bookingPeriods))
    }

    return <div
        className={styles.calendar}
    >
        <div className={styles.week}>
            <div className={styles.weekNumber}>Uke</div>
            <div className={styles.weekDays}>
                {WEEKDAYS.map(day => <div key={uuid()}>{day}</div>)}
            </div>
        </div>

        {weeks.map((week, index) => <CalendarWeek week={week} key={index} callback={callback} />)}
    </div>
}

function CalendarWeek({
    week,
    callback
}: {
    week: Week,
    callback: (day: Day) => void
}) {
    return <div className={styles.week} >
        <div className={styles.weekNumber}>{week.number}</div>
        <div className={styles.weekDays}>
            {week.days.map(day => <CalendarDay day={day} key={uuid()} callback={callback} />)}
        </div>
    </div>
}

function CalendarDay({
    day,
    callback
}: {
    day: Day,
    callback: (sourceDay: Day) => void
}) {
    const classList: string[] = [styles.day]
    if (!day.correctMonth) classList.push(styles.wrongMonth)

    const selectionMap: Record<Selection, string> = {
        [Selection.START]: styles.start,
        [Selection.END]: styles.end,
        [Selection.INRANGE]: styles.inRange
    }

    function getSelectionStyle(sel?: Selection): string {
        if (sel === undefined) return ''
        return selectionMap[sel]
    }

    classList.push(getSelectionStyle(day.selection))

    const styleMap: Record<BookingPeriodType, string> = {
        ROOM: styles.ROOM,
        CABIN: styles.CABIN,
        EVENT: styles.EVENT,
        RESERVED: styles.RESERVED,
    }

    return <div
        className={classList.join(' ')}
        onMouseDown={() => callback(day)}
    >
        <div className={styles.dateNumber}>{day.date.getDate()}</div>
        <div className={styles.markerContainer}>
            {day.markers.map(marker =>
                <div
                    className={`${styleMap[marker.type]} ${getSelectionStyle(marker.selection)}`}
                    key={uuid()}
                >
                    {marker.selection === Selection.INRANGE ? marker.notes : ''}
                </div>
            )}
        </div>
    </div>
}
