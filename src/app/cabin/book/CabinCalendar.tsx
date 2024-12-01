'use client'
import styles from './CabinCalendar.module.scss'
import { dateLessThan, datesEqual, getWeekNumber } from '@/lib/dates/comparison'
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { ReactNode } from 'react'
import type { Record } from '@prisma/client/runtime/library'

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']
const MONTHS = [
    'Januar',
    'Februar',
    'Mars',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Desember'
]

enum Selection {
    'START',
    'END',
    'INRANGE'
}

type Day = {
    date: Date,
    selection?: Selection,
}

type Week = {
    days: (Day | null)[],
    number: number,
}

type DateRange = {
    start?: Date,
    end?: Date,
}

function createNullArray(num: number): null[] {
    return Array.from({ length: num }).map(() => null)
}

function generateCalendarData(startDate: Date, endDate: Date, dateRange: DateRange): (Week | string)[] {
    const firstDayOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)

    const firstDayOfFirstWeek = new Date(startDate)
    const firstDayOfFirstWeekOffset = firstDayOfMonth.getDate() - firstDayOfMonth.getDay() + 1
    firstDayOfFirstWeek.setDate(firstDayOfFirstWeekOffset)

    const ret: (Week | string)[] = []

    let lastMonth = firstDayOfMonth.getUTCMonth() - 1

    for (let i = 0; i < 20; i++) {
        const mondayDate = new Date(firstDayOfFirstWeek)
        mondayDate.setDate(mondayDate.getDate() + 7 * i)

        let days: (Day | null)[] = []

        for (let j = 0; j < 7; j++) {
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

            if (lastMonth !== thisDate.getUTCMonth()) {
                lastMonth = thisDate.getUTCMonth()
                if (days.length > 0) {
                    ret.push({
                        number: getWeekNumber(mondayDate),
                        days: [...days, ...createNullArray(7 - days.length)]
                    })
                }

                ret.push(MONTHS[thisDate.getUTCMonth()])

                days = createNullArray(days.length)
            }

            days.push({
                date: thisDate,
                selection,
            })
        }

        if (i === 0 && dateLessThan(mondayDate, firstDayOfMonth)) {
            // This will only happen the first week
            ret.splice(0, 2)
        }

        ret.push({
            number: getWeekNumber(mondayDate),
            days
        })
    }


    return ret
}

export default function CabinCalendar({
    startDate,
    bookingUntil
}: {
    startDate: Date,
    bookingUntil: Date,
}) {
    const [dateRange, setDateRange] = useState<DateRange>({})
    const [lastChangeWasStart, setLastChangeWasStart] = useState(false)
    const [weeks, setWeeks] = useState(generateCalendarData(startDate, bookingUntil, dateRange))

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
        setWeeks(generateCalendarData(startDate, bookingUntil, newDateRange))
    }

    return <div
        className={styles.calendar}
    >
        <div className={`${styles.week} ${styles.weekHeader}`}>
            <div className={styles.weekNumber}>Uke</div>
            <div className={styles.weekDays}>
                {WEEKDAYS.map(day => <div key={uuid()}>{day}</div>)}
            </div>
        </div>

        {weeks.map((week, index) => {
            if (typeof week === 'string') {
                return <MonthHeader key={index}>{week}</MonthHeader>
            }
            return <CalendarWeek week={week} key={index} callback={callback} />
        })}
    </div>
}

function MonthHeader({
    children
}: {
    children: ReactNode
}) {
    return <h2 className={styles.monthHeader}>{children}</h2>
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
            {week.days.map(day => {
                if (day) return <CalendarDay day={day} key={uuid()} callback={callback} />
                return <div key={uuid()} className={styles.day}></div>
            })}
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
    const classList: string[] = [styles.day, styles.exists]

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

    return <div
        className={classList.join(' ')}
        onMouseDown={() => callback(day)}
    >
        <div className={styles.dateNumber}>{day.date.getDate()}</div>
    </div>
}
