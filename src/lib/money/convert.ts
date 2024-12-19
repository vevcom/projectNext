import { currencySymbol } from './ConfigVars'

// TODO: Verify that @Pauliusj doesn't implement a similar function
export const convertPrice = (price: string | number): number => Math.floor(Number(price) * 100)

export function displayPrice(price: number, short: boolean = true): string {
    const convertedPrice = price / 100
    const priceString = convertedPrice.toFixed(2)
    if (short) return priceString

    return `${priceString} ${currencySymbol}`
}
