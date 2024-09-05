'use client'
import styles from './Countdown.module.scss';
import TimeLeft from './TimeLeft'
import CommitteeLogoRoll from './CommitteeLogoRoll';
import Speedlines from './Speedlines';
import { CountdownInfo } from '@/services/applications/period/Types';
import useInterval from '@/hooks/useInterval';
import { useState } from 'react';
import FinalCountdown from './FinalCountdown';

type PropTypes = {
    info: CountdownInfo
}

export default function Countdown({ info }: PropTypes) {
    const [showCommitteeRoll, setShowComitteeRoll] = useState(true)
    const [finalCountdown, setFinalCountdown] = useState(false)

    useInterval(() => {
        if (new Date().getTime() + 30_000 > info.endTime.getTime()) {
            setShowComitteeRoll(false)
            setTimeout(() => {
                setFinalCountdown(true);
            }, Math.max(0, info.endTime.getTime() - new Date().getTime() - 12_000));
        }
    }, 10_000)

    return (
        <div className={styles.Countdown}>
            <div className={styles.top}>
                {!finalCountdown && (
                    <TimeLeft end={info.endTime} />
                )}
            </div>
            <div className={styles.under}>
                <Speedlines />
                {showCommitteeRoll && (
                    <CommitteeLogoRoll committees={info.commiteesParticipating} />
                )}
                {finalCountdown && (
                    <FinalCountdown />
                )}
            </div>
        </div>
    )
}