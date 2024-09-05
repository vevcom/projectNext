import styles from './FinalCountdown.module.scss'
import useInterval from '@/hooks/useInterval'
import { useEffect, useRef, useState } from 'react'

export default function FinalCountdown() {
    const [timeLeft, setTimeLeft] = useState<number | null>(11)
    const ref = useRef<HTMLDivElement>(null)

    const [applicants, setApplicants] = useState(0)

    useEffect(() => {
        fetch('https://omega.ntnu.no/api/applications/applicants').then(res => res.json()).then(data => {
            setApplicants(data)
        }).catch(console.log)
    }, [])

    useInterval(() => {
        if (timeLeft === null) return
        ref.current?.classList.remove(styles.animate)
        setTimeout(() => ref.current?.classList.add(styles.animate), 100)
        setTimeout(() => setTimeLeft(timeLeft - 1 >= 0 ? timeLeft - 1 : null), 50)
    }, 1000)

    return (
        <div ref={ref} className={styles.FinalCountdown}>
            { timeLeft === null ? <h1 className={styles.applicants}>
                {applicants} <br /> søkere
            </h1> : <h1>{timeLeft}</h1> }

        </div>
    )
}
