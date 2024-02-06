import { OmegaquoteFiltered } from "@/actions/quotes/read"
import styles from "./omegaquotesQuote.module.scss"

export type OmegaquoteQuotePropTypes = {
    quote: OmegaquoteFiltered
}

export default function OmegaquoteQuote({ quote } : OmegaquoteQuotePropTypes) {
    const dateString = `${quote.timestamp.getDay()}.${quote.timestamp.getMonth()}.${quote.timestamp.getFullYear()}`

    return <div className={styles.OmegaquoteQuote}>
        <div className={styles.QuoteBubble}>
            <p>"{ quote.quote }"</p>
        </div>
        <span className={styles.triangle}>▼</span>
        <h3>
            { quote.author }
        </h3>
        <span className={styles.timestamp}>{ dateString }</span>
    </div>
}