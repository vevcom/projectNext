'use server'

import ProductForm from './productForm'
import styles from './page.module.scss'
import { readProducts } from '@/actions/shop'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { v4 as uuid } from 'uuid'


export default async function ProductPage() {
    const products = unwrapActionReturn(await readProducts(null))

    return <PageWrapper
        title="Produkter"
        headerItem={
            <AddHeaderItemPopUp PopUpKey="ProductForm">
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
                {products.map(product => <tr key={uuid()}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.barcode ?? 'Ingen'}</td>
                </tr>)}
            </tbody>
        </table>
    </PageWrapper>
}
