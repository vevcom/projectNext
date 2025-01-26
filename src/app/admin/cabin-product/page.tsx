import styles from './page.module.scss'
import { UpdateCabinProductForm } from './UpdateCabinProductForm'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import { readCabinProductsAction } from '@/actions/cabin'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { v4 as uuid } from 'uuid'
import Link from 'next/link'

export default async function CabinProducs() {
    const products = unwrapActionReturn(await readCabinProductsAction())

    return <PageWrapper
        title="Heutte produkter"

        headerItem={<AddHeaderItemPopUp PopUpKey="UpdateCabinProductForm">
            <UpdateCabinProductForm />
        </AddHeaderItemPopUp>}
    >

        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Produkt</th>
                    <th>Type</th>
                    <th>Antall</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => <Link key={uuid()} href={`/admin/cabin-product/${product.id}`}>
                    <tr>
                        <td>{product.name}</td>
                        <td>{product.type}</td>
                        <td>{product.amount}</td>
                    </tr>
                </Link>
                )}
            </tbody>
        </table>
    </PageWrapper>
}

