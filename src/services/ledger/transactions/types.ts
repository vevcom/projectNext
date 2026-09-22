import type { Prisma } from '@/prisma-generated-pn-types'

export type ExpandedLedgerTransaction = Prisma.LedgerTransactionGetPayload<{
    include: {
        ledgerEntries: true,
        payment: {
            include: {
                stripePayment: true,
                manualPayment: true,
            },
        },
    }
}>
