import BankCardModal from '@/components/Ledger/Modals/BankCardModal'
import Card from '@/components/UI/Card'
import Link from 'next/link'

type Props = {
    userId: number,
}

export default function LedgerAccountPaymentMethods({ userId }: Props) {
    return <Card>
        <h2>Betalingsalternativer</h2>
        <h3>Bankkort</h3>
        <p>
            Du kan lagre kortinformasjonen din for senere betalinger.
            Kortinformasjonen lagres kun hos betalingsleverandøren vår Stripe, ikke på våre tjenere.
        </p>
        <BankCardModal userId={userId} />
        <h3>NTNU-kort</h3>
        <p>
            For å benytte Kioleskabet på Lophtet må et NTNU-kort være tilknyttet brukeren din.
        </p>
        <Link href="settings">Gå til siden for kortregistrering.</Link>
    </Card>
}
