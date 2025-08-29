import type { Prisma } from "@prisma/client";

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
