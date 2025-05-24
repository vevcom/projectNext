import SimpleTable from '@/app/_components/Table/SimpleTable'
import { displayPrice } from '@/lib/money/convert'
import { calculateCabinBookingPrice, calculateTotalCabinBookingPrice } from '@/services/cabin/booking/cabinPriceCalculator'
import type { CabinPriceCalculatorReturnType } from '@/services/cabin/booking/cabinPriceCalculator'
import type { PricePeriod } from '@prisma/client'
import type { CabinProductConfig } from '@/services/cabin/product/config'


export default function CabinPriceCalculator({
    pricePeriods,
    products,
    productAmounts,
    startDate,
    endDate,
    numberOfMembers,
    numberOfNonMembers,
}: {
    pricePeriods: PricePeriod[],
    products: CabinProductConfig.CabinProductExtended[],
    productAmounts: number[],
    startDate?: Date,
    endDate?: Date,
    numberOfMembers: number,
    numberOfNonMembers: number,
}) {
    if (products.length !== productAmounts.length) {
        throw new Error('The products and product amounts must be the same length')
    }
    let priceData: CabinPriceCalculatorReturnType[] = []
    let totalPrice = 0

    if (startDate && endDate) {
        priceData = calculateCabinBookingPrice({
            pricePeriods,
            products,
            productAmounts,
            startDate,
            endDate,
            numberOfMembers,
            numberOfNonMembers
        })
        totalPrice = calculateTotalCabinBookingPrice(priceData)
    }

    const tableBody: string[][] = []

    for (const priceRow of priceData) {
        const description = priceRow.productPrice.description
        const displayName = priceRow.product.name + (description ? ` (${description})` : '')
        tableBody.push([
            displayName,
            displayPrice(priceRow.productPrice.price),
            priceRow.amount.toString(),
            displayPrice(priceRow.amount * priceRow.productPrice.price)
        ])
    }

    return <div>
        <SimpleTable
            header={['Produkt', 'Pris per natt', 'Antall', 'Total Pris']}
            body={tableBody}
        />
        <p>Total pris {displayPrice(totalPrice)}</p>
    </div>
}
