import Card from '@/components/UI/Card'
import Link from 'next/link'

type Props = {
    transactionsHref?: string,
}

export default function LedgerAccountTransactionSummary({ transactionsHref }: Props) {
    return <Card>
        <h2>Transaksjoner</h2>
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
        { transactionsHref && <Link href={transactionsHref}>Se alle transaksjoner -&gt;</Link> }
    </Card>
}
