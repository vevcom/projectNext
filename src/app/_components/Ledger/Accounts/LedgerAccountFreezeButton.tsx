'use client'

import Button from '@/components/UI/Button'
import { updateLedgerAccountAction } from '@/services/ledger/ledgerAccount/actions'
import { LedgerAccount } from '@prisma/client'
import { useRouter } from 'next/navigation';

export default function LedgerAccountFreezeButton({ ledgerAccount, className }: { ledgerAccount: LedgerAccount, className?: string }) {
    const { refresh } = useRouter();

    const toggleFrozen = async () => {
        await updateLedgerAccountAction({
            params: {
                id: ledgerAccount.id,
            },
        }, {
            data: {
                frozen: !ledgerAccount.frozen,
            }
        })
        refresh()
    }

    return (
        <Button color="secondary" className={className} onClick={toggleFrozen}>{ledgerAccount.frozen ? "Tin konto" : "Frys konto"}</Button>
    )
}