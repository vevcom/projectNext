import Card from '@/components/UI/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

type Props = {
    ledgerAccountId: number,
    transactionsHref?: string,
}

export default function LedgerAccountTransactionSummary({ transactionsHref }: Props) {
    return <Card heading="Transaksjoner">
        {
            transactionsHref &&
            <Link href={transactionsHref}>
                Se alle transaksjoner <FontAwesomeIcon icon={faArrowRight} />
            </Link>
        }
    </Card>
}
