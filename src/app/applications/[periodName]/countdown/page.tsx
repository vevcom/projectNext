import { readPeriodCountdownAction } from '@/actions/applications/period/read';
import styles from './page.module.scss';
import type { PropTypes } from '@/app/applications/[periodName]/page';
import Countdown from './Countdown'
import CommitteeLogoRoll from './CommitteeLogoRoll';
import Speedlines from './Speedlines';

export default async function ApplicationPeriodCountdown({ params }: PropTypes) {
    console.log(params);
    const infoRes = await readPeriodCountdownAction({ periodName: decodeURIComponent(params.periodName) });
    console.log(infoRes);
    if (!infoRes.success) throw new Error('Failed to read countdown info');
    const info = infoRes.data;

    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <Countdown end={info.endTime} />
            </div>
            <div className={styles.under}>
                <CommitteeLogoRoll committees={info.commiteesParticipating} />
                <Speedlines />
            </div>
        </div>
    )
}