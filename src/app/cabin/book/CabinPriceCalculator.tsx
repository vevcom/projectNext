import type { BookingType } from '@prisma/client'
import type { CabinProductConfig } from '@/services/cabin/product/config'
import { DateRange } from './CabinCalendar'


export default function CabinPriceCalculator({
    cabinProducts,
    dateRange,
    type,
}: {
    cabinProducts: CabinProductConfig.CabinProductExtended[],
    dateRange: DateRange,
    type: BookingType,
}) {
    const relevantProducts = cabinProducts.filter(product => product.type === type)

    console.log(relevantProducts)

    return <div>

    </div>
}
