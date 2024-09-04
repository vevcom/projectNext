import { readPeriodCountdownAction } from '@/actions/applications/period/read';
import styles from './page.module.scss';
import type { PropTypes } from '@/app/applications/[periodName]/page';

export async function ApplicationPeriodCountdown({ params }: PropTypes) {
    const infoRes = await readPeriodCountdownAction({ periodName: decodeURIComponent(params.periodName) });
    if (!infoRes.success) throw new Error('Failed to read countdown info');
    const info = infoRes.data;

    return (
        <div className={styles.wrapper}>

        </div>
    )
}