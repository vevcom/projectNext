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
        <table>
            <tbody>
                <tr>
                    <td>En transaksjon</td>
                </tr>
                <tr>
                    <td>En annen transaksjon</td>
                </tr>
            </tbody>
        </table>
        {
            transactionsHref &&
            <Link href={transactionsHref}>
                Se alle transaksjoner <FontAwesomeIcon icon={faArrowRight} />
            </Link>
        }
    </Card>
}
