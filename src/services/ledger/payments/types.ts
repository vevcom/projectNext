import type { Prisma } from '@/prisma-generated-pn-types'

export type ExpandedPayment = Prisma.PaymentGetPayload<{
    include: {
        stripePayment: true,
        manualPayment: true,
    },
}>
