import { OmegaquoteFiltered } from "@/actions/quotes/read"
import styles from "./omegaquotesQuote.module.scss"

export type OmegaquoteQuotePropTypes = {
    quote: OmegaquoteFiltered
}

export default function OmegaquoteQuote({ quote } : OmegaquoteQuotePropTypes) {
    console.log(quote);
    return <div>
        <h3>
            { quote.author }
        </h3>
        <div>{ quote.quote }</div>
    </div>
}