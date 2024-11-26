import styles from './CabinCalendar.module.scss'
import { v4 as uuid } from 'uuid'

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']

type Week = {
    days: {
        active: boolean,
        date: Date
    }[],
    number: number,
}

function getWeekNumber(date: Date): number {
    const startDate = new Date(date.getFullYear(), 0, 1)
    const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
    return Math.ceil((days + startDate.getDay() + 1) / 7)
}

function generateCalendarData(date: Date): Week[] {
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

                return {
                    active: currentMonth === thisDate.getMonth(),
                    date: thisDate
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
    const weeks = generateCalendarData(date)

    return <div className={styles.calendar}>
        <div className={styles.week}>
            <div className={styles.weekNumber}>Uke</div>
            <div className={styles.weekDays}>
                {WEEKDAYS.map(day => <div key={uuid()}>{day}</div>)}
            </div>
        </div>

        {weeks.map((week, index) => <div className={styles.week} key={index}>
            <div className={styles.weekNumber}>{week.number}</div>
            <div className={styles.weekDays}>
                {week.days.map(day =>
                    <div key={uuid()} className={`${styles.day} ${day.active ? '' : styles.wrongMonth}`}>
                        {day.date.getDate()}
                    </div>
                )}
            </div>
        </div>)}
    </div>
}
