import type { Prisma } from '@prisma/client'

export type ExpandedPayment = Prisma.PaymentGetPayload<{
    include: {
        stripePayment: true,
        manualPayment: true,
    },
}>
