import { readShop } from '@/actions/shop'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { notFound } from 'next/navigation'


export default async function Shop(params: {
    params: {
        shop: string
    }
}) {
    const shopId = parseInt(params.params.shop, 10)
    if (isNaN(shopId)) notFound()

    const shopData = unwrapActionReturn(await readShop({
        shopId,
    }))

    if (!shopData) notFound()

    return <PageWrapper
        title={shopData.name}
    >
        hei hei
    </PageWrapper>
}
