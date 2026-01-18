'use server'

import ProductForm from './productForm'
import styles from './page.module.scss'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { sortObjectsByName } from '@/lib/sortObjects'
import { readProductsAction } from '@/services/shop/actions'
import { v4 as uuid } from 'uuid'
import Link from 'next/link'


export default async function ProductPage() {
    const products = unwrapActionReturn(await readProductsAction())

    return <PageWrapper
        title="Produkter"
        headerItem={
            <AddHeaderItemPopUp popUpKey="ProductForm">
                <ProductForm />
            </AddHeaderItemPopUp>
        }
    >
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Produkt</th>
                    <th>Beskrivelse</th>
                    <th>Strekkode</th>
                </tr>
            </thead>
            <tbody>
                {sortObjectsByName(products).map(product => <tr key={uuid()}>
                    <td>
                        <Link style={{ display: 'contents' }} href={`./product/${product.id}`} passHref>
                            {product.name}
                        </Link>
                    </td>
                    <td>{product.description}</td>
                    <td>{product.barcode ?? ''}</td>
                </tr>)}
            </tbody>
        </table>
    </PageWrapper>
}
