import { currencySymbol } from './config'

// TODO: Verify that @Pauliusj doesn't implement a similar function
// I haven't :) -Paulius
export function convertAmount(amount: string | number): number {
    if (typeof amount === 'string') {
        amount = amount.replace(',', '.')
    }

    return Math.round(Number(amount) * 100)
}

export function displayAmount(amount: number, short: boolean = true): string {
    const convertedamount = amount / 100
    const amountString = convertedamount.toFixed(2)
    if (short) return amountString

    return `${amountString} ${currencySymbol}`
}
