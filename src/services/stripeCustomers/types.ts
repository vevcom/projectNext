import type Stripe from 'stripe'

export type FilteredPaymentMethod = {
    id: string,
    type: Stripe.PaymentMethod.Type,
    card?: Pick<Stripe.PaymentMethod.Card, 'brand' | 'last4' | 'exp_month' | 'exp_year'>,
}
