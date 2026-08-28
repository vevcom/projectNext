import { UpdateCabinProductForm } from './UpdateCabinProductForm'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import { readCabinProductsAction } from '@/services/cabin/actions'
import { cabinProductAuth } from '@/services/cabin/product/auth'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { ServerSession } from '@/auth/session/ServerSession'
import SimpleTable from '@/app/_components/Table/SimpleTable'

export default async function CabinProducs() {
    cabinProductAuth.create.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).redirectOnUnauthorized({ returnUrl: '/admin/cabin-product' })

    const products = unwrapActionReturn(await readCabinProductsAction())

    return <PageWrapper
        title="Heutte produkter"

        headerItem={<AddHeaderItemPopUp popUpKey="UpdateCabinProductForm">
            <UpdateCabinProductForm />
        </AddHeaderItemPopUp>}
    >

        <SimpleTable
            header={[
                'Produkt',
                'Type',
                'Antall'
            ]}
            body={products.map(product => [
                product.name,
                product.type,
                product.amount.toString()
            ])}
            links={products.map(product => `/admin/cabin-product/${product.id}`)}
        />
    </PageWrapper>
}

