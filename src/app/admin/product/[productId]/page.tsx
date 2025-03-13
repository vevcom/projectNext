import styles from './page.module.scss'
import ProductForm from '@/app/admin/product/productForm'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { displayPrice } from '@/lib/money/convert'
import { readProductAction } from '@/actions/shop/product'
import { v4 as uuid } from 'uuid'
import Link from 'next/link'

type PropTypes = {
    params: Promise<{
        productId: number
    }>
}

export default async function ProductPage({ params }: PropTypes) {
    const product = unwrapActionReturn(await readProductAction({ productId: Number((await params).productId) }))

    return <PageWrapper
        title={product.name}
    >
        <ProductForm product={product} />

        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Navn</th>
                    <th>Aktiv</th>
                    <th>Pris</th>
                </tr>
            </thead>
            <tbody>
                {product.ShopProduct.map(shopProduct => <tr key={uuid()}>
                    <td><Link href={`/admin/shop/${shopProduct.shopId}`}>{shopProduct.shop.name}</Link></td>
                    <td>{shopProduct.active ? 'AKTIV' : 'INAKTIV'}</td>
                    <td>{displayPrice(shopProduct.price, false)}</td>
                </tr>)}
            </tbody>
        </table>
    </PageWrapper>
}
