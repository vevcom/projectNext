import styles from './DotExpieries.module.scss'
import DateDisplay from '@/components/Date/Date'
import type { DotExpanded } from '@/services/dots/types'

type PropTypes = {
    dot: DotExpanded,
}

/**
 * The expiry of every value of a dot. The values are served in order, so the ones that have already
 * expired are the first `value - valueLeft` of them.
 */
export default function DotExpieries({ dot }: PropTypes) {
    const expiredValues = dot.value - dot.valueLeft

    return (
        <div className={styles.DotExpieries}>
            {
                dot.expiryForEachDotValue.map((expiry, index) => (
                    <span key={expiry.toISOString()} className={index < expiredValues ? styles.expired : ''}>
                        <DateDisplay date={expiry} includeTime={false} />
                    </span>
                ))
            }
        </div>
    )
}
