import { EditProductForShopForm } from './EditProductForShopForm'
import styles from './page.module.scss'
import FindProductForm from './FindProductForm'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import PopUp from '@/app/_components/PopUp/PopUp'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { displayPrice } from '@/lib/money/convert'
import { sortObjectsByName } from '@/lib/sortObjects'
import { readShopAction } from '@/actions/shop/shop'
import { readProductsAction } from '@/actions/shop/product'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { notFound } from 'next/navigation'
import { v4 as uuid } from 'uuid'
import type { Product } from '@prisma/client'

type PropTypes = {
    params: Promise<{
        shop: string
    }>
}

export default async function Shop({ params }: PropTypes) {
    const shopId = parseInt((await params).shop, 10)
    if (isNaN(shopId)) notFound()

    const shopData = unwrapActionReturn(await readShopAction({
        shopId,
    }))

    if (!shopData) notFound()

    const allProducts = unwrapActionReturn(await readProductsAction())
    let unconnectedProducts: Product[] = []
    if (allProducts) {
        const existingProductIds = new Set(shopData.products.map(p => p.id))
        unconnectedProducts = allProducts.filter(product => !existingProductIds.has(product.id))
    }

    return <PageWrapper
        title={shopData.name}
    >
        <p>{shopData.description}</p>

        <PopUp
            showButtonClass={styles.button}
            showButtonContent="Legg til Produkt"
            PopUpKey="createProductForShop"
        >
            <FindProductForm shopId={shopId} products={unconnectedProducts} />
            <br />
            <EditProductForShopForm shopId={shopId} />
        </PopUp>

        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Rediger</th>
                    <th>Produkt</th>
                    <th>Beskrivelse</th>
                    <th>Pris</th>
                </tr>
            </thead>
            <tbody>
                {sortObjectsByName(shopData.products).map(product => <tr
                    key={uuid()}
                    className={product.active ? '' : styles.deactivatedProduct}
                >
                    <td className={styles.editButtonWrapper}>
                        <PopUp
                            showButtonContent={<FontAwesomeIcon icon={faPencil} />}
                            PopUpKey={'EditProductForShop'}
                        >
                            <EditProductForShopForm shopId={shopId} product={product} />
                        </PopUp>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{displayPrice(product.price, false)}</td>
                </tr>)}
            </tbody>
        </table>
    </PageWrapper>
}
