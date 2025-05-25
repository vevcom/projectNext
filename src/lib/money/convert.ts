import { currencySymbol } from './ConfigVars'

/**
 * Converts a price from kroner to ører
 * @param price The price in kroner
 * @returns The price in øre as an integer
 */
export const convertPrice = (price: string | number): number => Math.floor(Number(price) * 100)

export function displayPrice(price: number, short: boolean = true): string {
    const convertedPrice = price / 100
    const priceString = convertedPrice.toFixed(2)
    if (short) return priceString

    return `${priceString} ${currencySymbol}`
}
