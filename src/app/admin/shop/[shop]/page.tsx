import { CreateProductForShopForm } from './CreateProductForShopForm'
import styles from './page.module.scss'
import { readShop } from '@/actions/shop'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import PopUp from '@/app/_components/PopUp/PopUp'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { displayPrice } from '@/lib/money/convert'
import { notFound } from 'next/navigation'
import { v4 as uuid } from 'uuid'

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
        <p>{shopData.description}</p>

        <PopUp
            showButtonClass={styles.button}
            showButtonContent="Legg til Produkt"
            PopUpKey="createProductForShop"
        >
            <CreateProductForShopForm shopId={shopId} />
        </PopUp>

        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Produkt</th>
                    <th>Pris</th>
                </tr>
            </thead>
            <tbody>
                {shopData.products.map(product => <tr key={uuid()}>
                    <td>{product.name}</td>
                    <td>{displayPrice(product.price, false)}</td>
                </tr>)}
            </tbody>
        </table>
    </PageWrapper>
}
