import NumberInput from '@/app/_components/UI/NumberInput'
import type { CabinProductConfig } from '@/services/cabin/product/config'


export default function SelectBedProducts({
    bedProducts,
    onChange,
    amounts,
}: {
    bedProducts: CabinProductConfig.CabinProductExtended[],
    onChange: (product: number[]) => void
    amounts: number[],
}) {
    if (bedProducts.length === 0) {
        throw new Error('No products of the given type')
    }

    return <>
        {bedProducts.map((product, index) =>
            <NumberInput
                key={index}
                name={`product-${product.id}`}
                label={product.name}
                value={amounts[index]}
                onChange={(e) => {
                    const value = Number(e.target.value)
                    if (value >= 0 && value <= product.amount) {
                        const newAmounts = [...amounts]
                        newAmounts[index] = value
                        onChange(newAmounts)
                    }
                }}
            />
        )}
    </>
}
