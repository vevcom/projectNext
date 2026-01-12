'use client'

import Button from '@/components/UI/Button'
import { updateLedgerAccountAction } from '@/services/ledger/accounts/actions'
import { useRouter } from 'next/navigation'
import type { LedgerAccount } from '@prisma/client'

export default function LedgerAccountFreezeButton({
    ledgerAccount,
    className
}: { ledgerAccount: LedgerAccount, className?: string }) {
    const { refresh } = useRouter()

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
        <Button color="secondary" className={className} onClick={toggleFrozen}>
            {ledgerAccount.frozen ? 'Tin konto' : 'Frys konto'}
        </Button>
    )
}
