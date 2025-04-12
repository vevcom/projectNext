import styles from './page.module.scss'
import { UpdateCabinProductPriceForm } from './UpdateCabinProductPriceForm'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import { readCabinProductAction } from '@/actions/cabin'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { displayDate } from '@/lib/dates/displayDate'
import SimpleTable from '@/app/_components/Table/SimpleTable'
import { displayPrice } from '@/lib/money/convert'
import Link from 'next/link'

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
            <UpdateCabinProductPriceForm productId={product.id} productType={product.type} />
        </AddHeaderItemPopUp>}
    >
        <div className={styles.infoDiv}>
            <p>kanskje en måte å redigere på som en HeaderItem?</p>

            <p>
                Her bruker vi en egen syntax til å skrive et tidsintervall en pris er gyldig i.
                Syntax er inspirert fra Cron, der vi kun inkluderer de siste tre delene for å holde oss til datoer.
                For å lese mer se her:  <Link href="https://crontab.guru/">crontab.guru</Link>.
                Siden vi har implemtert denne parsingen selv, er syntace litt begrenset.
                De tre feltene som vi har implementert er (<i>day of month</i>, <i>month</i>, <i>day of week</i>).
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
                'Andel i Omega',
                'Cron intervall'
            ]}
            body={product.CabinProductPrice.map(priceObj => [
                priceObj.description,
                displayPrice(priceObj.price),
                displayDate(priceObj.validFrom, false),
                priceObj.memberShare.toString(),
                priceObj.cronInterval ?? '',
            ])}
        />
    </PageWrapper>
}
