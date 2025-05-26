import styles from './page.module.scss'
import Countdown from './Countdown'
import type { PropTypes } from '@/app/applications/[periodName]/page'
import { readPeriodCountdownAction } from '@/actions/applications/periods/read'

export default async function ApplicationPeriodCountdown({ params }: PropTypes) {
    const infoRes = await readPeriodCountdownAction({
        periodName: decodeURIComponent(params.periodName)
    })
    if (!infoRes.success) throw new Error('Failed to read countdown info')
    const info = infoRes.data

    return (
        <div className={styles.wrapper}>
            <Countdown info={info} />
        </div>
    )
}
