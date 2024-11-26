'use client'
import styles from './CabinCalendar.module.scss'
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']

type Day = {
    correctMonth: boolean,
    date: Date,
    selected: boolean,
    inRange: boolean,
}

type Week = {
    days: Day[],
    number: number,
}

type DateRange = {
    start?: Date,
    end?: Date,
}

function getWeekNumber(date: Date): number {
    const startDate = new Date(date.getFullYear(), 0, 1)
    const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
    return Math.ceil((days + startDate.getDay() + 1) / 7)
}

function datesEqual(lhs?: Date, rhs?: Date) {
    if (!lhs && !rhs) return true
    if (!lhs || !rhs) return false
    return lhs.getFullYear() === rhs.getFullYear() && lhs.getMonth() === rhs.getMonth() && lhs.getDate() === rhs.getDate()
}

function generateCalendarData(date: Date, dateRange: DateRange): Week[] {
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

                let selected = false
                let inRange = false
                selected = datesEqual(thisDate, dateRange.start) || datesEqual(thisDate, dateRange.end)

                if (dateRange.start && dateRange.end) {
                    inRange = dateRange && dateRange.start <= thisDate && thisDate < dateRange.end
                }

                return {
                    correctMonth: currentMonth === thisDate.getMonth(),
                    date: thisDate,
                    selected,
                    inRange,
                }
            })
        })
    }


    return ret
}

export default function CabinCalendar({
    date,
}: {
    date: Date
}) {
    const [dateRange, setDateRange] = useState<DateRange>({})
    const [lastChangeWasStart, setLastChangeWasStart] = useState(false)
    const [weeks, setWeeks] = useState(generateCalendarData(date, dateRange))

    function callback(day: Day) {
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
        console.log(newDateRange)
        setDateRange(newDateRange)
        setLastChangeWasStart(shouldChangeStart)
        setWeeks(generateCalendarData(date, newDateRange))
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
    if (day.selected) {
        classList.push(styles.selected)
    } else if (day.inRange) {
        classList.push(styles.inRange)
    }

    return <div
        className={classList.join(' ')}
        onMouseDown={() => callback(day)}
    >
        {day.date.getDate()}
    </div>
}
