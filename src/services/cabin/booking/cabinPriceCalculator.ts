import { dateMatchCron } from '@/lib/dates/cron'
import type { CabinProductExtended, CabinProductPriceExtended } from '@/services/cabin/product/constants'
import type { CabinProduct, CabinProductPrice, PricePeriod } from '@prisma/client'

function getDateArray(start: Date, end: Date) {
    const ret: Date[] = []

    const iterator = new Date(start)

    do {
        ret.push(new Date(iterator))

        iterator.setUTCDate(iterator.getUTCDate() + 1)
    } while (iterator < end)

    return ret
}

function matchPriceForDay({
    day,
    memberShare,
    pricePeriods,
    prices,
}: {
    day: Date,
    memberShare: number,
    pricePeriods: PricePeriod[],
    prices: CabinProductPriceExtended[]
}) {
    const currentPricePeriod = pricePeriods.findLast(period => period.validFrom <= day)
    if (!currentPricePeriod) {
        throw new Error('Could not find a price period for all the selected days')
    }

    const filtered = prices.filter(price => {
        if (price.pricePeriodId !== currentPricePeriod.id) {
            return false
        }

        if (price.memberShare > memberShare) {
            return false
        }

        if (!dateMatchCron(day, price.cronInterval)) {
            return false
        }

        return true
    })

    if (filtered.length === 0) {
        throw new Error(`No available price for the day ${day}`)
    }

    const sorted = filtered.sort((a, b) => a.price - b.price)

    return sorted[0]
}

export type CabinPriceCalculatorReturnType = {
    amount: number,
    productPrice: CabinProductPrice,
    product: CabinProduct
}

function findPricesForProduct({
    startDate,
    endDate,
    numberOfMembers,
    numberOfNonMembers,
    pricePeriods,
    product,
}: {
    startDate: Date,
    endDate: Date,
    numberOfMembers: number,
    numberOfNonMembers: number,
    pricePeriods: PricePeriod[],
    product: CabinProductExtended
}): CabinPriceCalculatorReturnType[] {
    const dateArray = getDateArray(startDate, endDate)
    let memberShare = Math.ceil(numberOfMembers / (numberOfMembers + numberOfNonMembers) * 100)
    if (isNaN(memberShare)) {
        memberShare = 0
    }

    const pricesHistogram: Record<string, number> = {}

    for (const day of dateArray) {
        const price = matchPriceForDay({ day, memberShare, pricePeriods, prices: product.CabinProductPrice })
        if (pricesHistogram[price.id] === undefined) {
            pricesHistogram[price.id] = 0
        }
        pricesHistogram[price.id]++
    }

    const ret: CabinPriceCalculatorReturnType[] = []

    for (const entry of Object.keys(pricesHistogram)) {
        ret.push({
            amount: pricesHistogram[entry],
            productPrice: product.CabinProductPrice.find(price => price.id === parseInt(entry, 10))!,
            product,
        })
    }

    return ret
}

export function calculateCabinBookingPrice({
    pricePeriods,
    products,
    productAmounts,
    startDate,
    endDate,
    numberOfMembers,
    numberOfNonMembers,
}: {
    pricePeriods: PricePeriod[],
    products: CabinProductExtended[],
    productAmounts: number[],
    startDate: Date,
    endDate: Date,
    numberOfMembers: number,
    numberOfNonMembers: number
}): CabinPriceCalculatorReturnType[] {
    if (products.length !== productAmounts.length) {
        throw new Error('The products and product amounts must be the same length')
    }

    if (numberOfMembers < 0 || numberOfNonMembers < 0) {
        throw new Error('The number of members and non-members cannot be negative')
    }

    if (startDate >= endDate) {
        throw new Error('The start date must be before the end date')
    }

    const ret: CabinPriceCalculatorReturnType[] = []

    for (let i = 0; i < products.length; i++) {
        const productPrices = findPricesForProduct({
            startDate,
            endDate,
            numberOfMembers,
            numberOfNonMembers,
            pricePeriods,
            product: products[i]
        })

        for (const price of productPrices) {
            if (productAmounts[i] < 0) {
                throw new Error('The product amount cannot be negative')
            }
            if (price.product.amount < productAmounts[i]) {
                throw new Error('The product amount cannot be greater than the product amount')
            }

            price.amount *= productAmounts[i]
            ret.push(price)
        }
    }

    return ret.filter(row => row.amount > 0)
}

export function calculateTotalCabinBookingPrice(priceData: CabinPriceCalculatorReturnType[]): number {
    let ret = 0

    for (const entry of priceData) {
        ret += entry.amount * entry.productPrice.price
    }

    return ret
}
