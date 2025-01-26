import styles from './page.module.scss'
import { UpdateCabinProductPriceForm } from './UpdateCabinProductPriceForm'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import { readCabinProductAction } from '@/actions/cabin'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { displayDate } from '@/lib/dates/displayDate'
import { v4 as uuid } from 'uuid'
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

        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Beskrivelse</th>
                    <th>Pris</th>
                    <th>Gyldig fra</th>
                    <th>Gruppe id</th>
                    <th>Cron intervall</th>
                </tr>
            </thead>
            <tbody>
                {product.CabinProductPrice.map(priceObject => <tr key={uuid()}>
                    <td>{priceObject.description}</td>
                    <td>{priceObject.price}</td>
                    <td>{displayDate(priceObject.validFrom, false)}</td>
                    <td>{priceObject.groupId}</td>
                    <td>{priceObject.cronInterval}</td>
                </tr>)}
            </tbody>
        </table>
    </PageWrapper>
}
