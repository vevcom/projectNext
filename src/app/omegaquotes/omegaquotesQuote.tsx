import styles from './omegaquotesQuote.module.scss'
import type { OmegaquoteFiltered } from '@/server/omegaquotes/Types'

export type OmegaquoteQuotePropTypes = {
    quote: OmegaquoteFiltered
}

export default function OmegaquoteQuote({ quote }: OmegaquoteQuotePropTypes) {
    const dateString = `${quote.timestamp.getDay()}.${quote.timestamp.getMonth()}.${quote.timestamp.getFullYear()}`

    return <div className={styles.OmegaquoteQuote}>
        <div className={styles.QuoteBubble}>
            <p>&quot;{ quote.quote }&quot;</p>
        </div>
        <span className={styles.triangle}>▼</span>
        <h3>
            { quote.author }
        </h3>
        <span className={styles.timestamp}>{ dateString }</span>
    </div>
}
