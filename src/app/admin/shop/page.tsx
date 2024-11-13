'use server'
import ShopForm from './shopForm'
import { readShops } from '@/actions/shop'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { v4 as uuid } from 'uuid'


export default async function Shop() {
    const shops = unwrapActionReturn(await readShops(null))

    return <PageWrapper
        title="Butikker"
        headerItem={
            <AddHeaderItemPopUp PopUpKey="createShopForm">
                <ShopForm />
            </AddHeaderItemPopUp>
        }
    >
        <table>
            <thead>
                <tr>
                    <th>Butikk</th>
                    <th>Beskrivelse</th>
                </tr>
            </thead>
            <tbody>
                {shops.map(shop => <tr key={uuid()}>
                    <td>{shop.name}</td>
                    <td>{shop.description}</td>
                </tr>)}
            </tbody>
        </table>
    </PageWrapper>
}
