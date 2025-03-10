import RadioLarge from '@/app/_components/UI/RadioLarge'
import type { CabinProductConfig } from '@/services/cabin/product/config'
import type { BookingType } from '@prisma/client'


export default function SelectCabinProduct({
    cabinProducts,
    type,
    onChange,
    value,
}: {
    cabinProducts: CabinProductConfig.CabinProductExtended[],
    type: BookingType,
    onChange: (product: CabinProductConfig.CabinProductExtended) => void
    value?: CabinProductConfig.CabinProductExtended,
}) {
    const relevantProducts = cabinProducts.filter(product => product.type === type)

    if (relevantProducts.length === 0) {
        return <>
            There are no products available
        </>
    }

    if (relevantProducts.length === 1) {
        return <></>
    }

    let indexOfValue = 0
    if (value) {
        indexOfValue = relevantProducts.map(product => product.id).indexOf(value.id)
        if (indexOfValue === -1) {
            return <></>
        }
    }

    return <RadioLarge
        name="Select product"
        options={relevantProducts.map((product, i) => ({
            label: product.name,
            value: i
        }))}
        value={indexOfValue}
        onChange={(index) => {
            onChange(relevantProducts[index])
        }}
    />
}
