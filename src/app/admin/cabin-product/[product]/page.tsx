import styles from './page.module.scss'
import { UpdateCabinProductPriceForm } from './UpdateCabinProductPriceForm'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import { readCabinProductAction } from '@/actions/cabin'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { displayDate } from '@/lib/dates/displayDate'
import Link from 'next/link'
import SimpleTable from '@/app/_components/Table/SimpleTable'
import { displayPrice } from '@/lib/money/convert'

export default async function CabinProduct({
    params,
}: {
    params: {
        product: string
    }
}) {
    const product = unwrapActionReturn(await readCabinProductAction({
        id: parseInt(params.product, 10),
    }))
    return <PageWrapper
        title={product.name}
        headerItem={<AddHeaderItemPopUp PopUpKey="AddCabinProductPrice">
            <UpdateCabinProductPriceForm productId={product.id} />
        </AddHeaderItemPopUp>}
    >
        <div className={styles.infoDiv}>
            <p>kanskje en måte å redigere på som en HeaderItem?</p>

            <p>
                Lurer du på hva Cron er?
                Det brukes for å angi generelle tidsintervaller.
                For å enkelt forstå den besøk <Link href="https://crontab.guru/">crontab.guru</Link>.
                Siden tidspunkter ikke har noe å si,
                ser vi bare på de tre siste uttrykkene (day of month, month, day fo week)
            </p>

            <p>
                Brukeren vil få den billigste prisen der brukeren oppfyller alle kravene under.
                Det vil si at dersom flere av reglene for priser matcher, får brukeren den billigste.
            </p>

        </div>

        <SimpleTable
            header={[
                'Beskrivelse',
                'Pris',
                'gyldig fra',
                'Gruppe id',
                'Cron intervall'
            ]}
            body={product.CabinProductPrice.map(priceObj => [
                priceObj.description,
                displayPrice(priceObj.price),
                displayDate(priceObj.validFrom, false),
                priceObj.groupId?.toString() ?? '',
                priceObj.cronInterval ?? '',
            ])}
        />
    </PageWrapper>
}
