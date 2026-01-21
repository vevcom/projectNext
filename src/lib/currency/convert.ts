import { currencySymbol } from './config'

// TODO: Verify that @Pauliusj doesn't implement a similar function
// I haven't :) -Paulius
export function convertAmount(amount: string | number): number {
    if (typeof amount === 'string') {
        amount = amount.replace(',', '.')
    }

    return Math.round(Number(amount) * 100)
}

export function displayAmount(amount: number, short: boolean = true, withSign: boolean = false): string {
    const convertedAmount = amount / 100
    const amountString = convertedAmount.toFixed(2)
    if (short) return amountString

    const sign = convertedAmount > 0 ? '+' : '-'

    return `${withSign && convertedAmount !== 0 ? sign : ''}${amountString} ${currencySymbol}`
}
