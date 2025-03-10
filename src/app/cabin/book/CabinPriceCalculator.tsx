import SimpleTable from '@/app/_components/Table/SimpleTable'
import { displayPrice } from '@/lib/money/convert'
import type { Record } from '@prisma/client/runtime/library'
import type { CabinProductPrice } from '@prisma/client'
import type { CabinProductConfig } from '@/services/cabin/product/config'

function getDateArray(start: Date, end: Date) {
    const ret: Date[] = []

    const iterator = new Date(start)

    do {
        ret.push(new Date(iterator))

        iterator.setUTCDate(iterator.getUTCDate() + 1)
    } while (iterator < end)

    return ret
}

function divideCronString(cronExpression: string) {
    const ret = []

    const splitted = cronExpression.split(' ')
    for (const part of splitted) {
        if (part.trim().length > 0) {
            ret.push(part.replaceAll(' ', ''))
        }
    }

    if (ret.length !== 3) throw new Error('The cron string is invalid')

    return ret
}

function createArrayFromRange(start: number, end: number) {
    const ret: number[] = []

    for (let i = start; i < end; i++) {
        ret.push(i)
    }

    return ret
}

function numberInCronExpression(number: number, cronExpressionPart: string) {
    // I guess the cron is parsed in this order: comma, step, range
    const commaSplit = cronExpressionPart.split(',')

    function parseCronRange(input: string): number[] {
        const parts = input.split('-')
        if (parts.length > 2) {
            throw new Error('The cron expression is invalid. Containing an invalid -')
        }

        if (parts.length === 1 && parts[0] === '*') {
            return createArrayFromRange(0, 32) // 31 is the maximum number that can appear
        }

        const startNumber = parseInt(parts[0], 10)

        if (parts.length === 1) {
            return [startNumber]
        }

        const endNumber = parseInt(parts[1], 10)
        if (startNumber >= endNumber) {
            throw new Error('The cron expression is invalid. The range must increase.')
        }

        return createArrayFromRange(startNumber, endNumber + 1)
    }

    const validNumbers = commaSplit.map(commaPart => {
        const parts = commaPart.split('/')
        if (parts.length > 2) {
            throw new Error('The cron expression is invalid. Containing an invalid /')
        }

        let result = parseCronRange(parts[0])

        if (parts.length === 2) {
            const divisor = parseInt(parts[1], 10)
            // BUG: The syntax 20/2 is not supported. This should return every even number from 20 to 30.
            // Now this will only return 20
            result = result.filter(num => (num % divisor) === 0)
        }
        return result
    }).flat()

    return validNumbers.includes(number)
}

function dateMatchCron(day: Date, cronExpression: string) {
    // Croninterval syntac: (day of month, month, day of week)
    const cronParsed = divideCronString(cronExpression)

    if (!numberInCronExpression(day.getUTCDate(), cronParsed[0])) return false
    if (!numberInCronExpression(day.getUTCMonth() + 1, cronParsed[1])) return false
    if (!numberInCronExpression(day.getUTCDay(), cronParsed[2])) return false
    return true
}

function matchPriceForDay(day: Date, omegaShare: number, prices: CabinProductPrice[]) {
    const filtered = prices.filter(price => {
        if (price.validFrom > day) {
            return false
        }

        if (price.omegaShare > omegaShare) {
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

function findPrices(
    startDate: Date,
    endDate: Date,
    numberOfMembers: number,
    numberOfNonMembers: number,
    product: CabinProductConfig.CabinProductExtended
) {
    const dateArray = getDateArray(startDate, endDate)
    let omegaShare = Math.ceil(numberOfMembers / (numberOfMembers + numberOfNonMembers) * 100)
    if (isNaN(omegaShare)) {
        omegaShare = 0
    }

    const pricesHistogram: Record<number, number> = {}

    for (const day of dateArray) {
        const price = matchPriceForDay(day, omegaShare, product.CabinProductPrice)
        if (pricesHistogram[price.id] === undefined) {
            pricesHistogram[price.id] = 0
        }
        pricesHistogram[price.id]++
    }

    return pricesHistogram
}

export default function CabinPriceCalculator({
    product,
    startDate,
    endDate,
    numberOfMembers,
    numberOfNonMembers,
}: {
    product?: CabinProductConfig.CabinProductExtended,
    startDate?: Date,
    endDate?: Date,
    numberOfMembers: number,
    numberOfNonMembers: number,
}) {
    let priceHist: Record<number, number> = {}
    let totalPrice = 0

    if (product && startDate && endDate) {
        priceHist = findPrices(startDate, endDate, numberOfMembers, numberOfNonMembers, product)

        totalPrice = Object.entries(priceHist).reduce((acc, [priceId, count]) => {
            const price = product.CabinProductPrice.find(prodPrice => prodPrice.id === parseInt(priceId, 10))
            if (!price) throw new Error('Price is not found')

            return acc + price.price * count
        }, 0)

        if (product.type === 'BED') {
            totalPrice *= (numberOfMembers + numberOfNonMembers)
        }
    }

    return <div>
        <SimpleTable
            header={['Produkt', 'Pris', 'Antall', 'Total Pris']}
            body={Object.entries(priceHist).map(([priceId, count]) => {
                if (!product) throw new Error('Product is not found')
                const price = product.CabinProductPrice.find(prodPrice => prodPrice.id === parseInt(priceId, 10))
                if (!price) throw new Error('Price is not found')

                const displayName = product.name + (price.description ? ` (${price.description})` : '')

                return [
                    displayName,
                    displayPrice(price.price),
                    count.toString(),
                    displayPrice(price.price * count)
                ]
            })}
        />
        {product?.type === 'BED' &&
            <p>Antall personer {numberOfMembers + numberOfNonMembers}, tabellen over gjelder per person.</p>
        }
        <p>Total pris {displayPrice(totalPrice)}</p>
    </div>
}
