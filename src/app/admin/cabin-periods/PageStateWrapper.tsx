'use client'
import styles from './page.module.scss'
import ReleasePeriodForm from './ReleasePeriodForm'
import PricePeriodForm from './PricePeriodForm'
import PopUp from '@/app/_components/PopUp/PopUp'
import { displayDate } from '@/lib/dates/displayDate'
import SimpleTable from '@/app/_components/Table/SimpleTable'
import Form from '@/app/_components/Form/Form'
import { destoryPricePeriodAction, destroyReleasePeriodAction } from '@/actions/cabin'
import { configureAction } from '@/actions/configureAction'
import { v4 as uuid } from 'uuid'
import type { PricePeriod, ReleasePeriod } from '@prisma/client'


export default function PageStateWrapper({
    releasePeriods,
    pricePeriods,
}: {
    releasePeriods: ReleasePeriod[],
    pricePeriods: PricePeriod[],
}) {
    function isPricePeriodReleased(pricePeriod: PricePeriod): boolean {
        return releasePeriods
            .filter(period => period.releaseTime <= new Date())
            .some(period => period.releaseUntil > pricePeriod.validFrom)
    }

    return <>

        <PopUp
            PopUpKey="CreateNewReleasePeriod"
            showButtonContent="Ny Slipp Periode"
            showButtonClass={styles.button}
        >
            <ReleasePeriodForm />
        </PopUp>

        <SimpleTable
            header={[
                'Slipptidspunkt',
                'Slipp til dato',
                'Slett',
            ]}
            body={releasePeriods.map(period => [
                displayDate(period.releaseTime, false),
                displayDate(period.releaseUntil, false),
                period.releaseTime < new Date() ? 'Slipp perioden er publisert.' :
                    <Form
                        key={uuid()}
                        action={configureAction(destroyReleasePeriodAction, {
                            params: { id: period.id },
                        })}
                        submitText="Slett"
                        submitColor="red"
                        confirmation={{
                            confirm: true,
                            text: 'Er du sikker på at du vil slette denne slipp perioden?'
                        }}
                    />
            ])}
        />

        <PopUp
            PopUpKey="CreateNewPricePeriod"
            showButtonContent="Ny Pris Periode"
            showButtonClass={styles.button}
        >
            <PricePeriodForm />
        </PopUp>

        <SimpleTable
            header={[
                'Start dato',
                'Slett'
            ]}
            body={pricePeriods.map(period => [
                displayDate(period.validFrom, false),
                <>
                    {isPricePeriodReleased(period) ? 'Pris perioden er publisert.' :
                        <Form
                            key={uuid()}
                            action={configureAction(destoryPricePeriodAction, {
                                params: { id: period.id },
                            })}
                            submitText="Slett"
                            submitColor="red"
                            confirmation={{
                                confirm: true,
                                // eslint-disable-next-line max-len
                                text: 'Er du sikker på at du vil slette denne pris perioden? Dette vil slette alle priser forbundet til perioden.'
                            }}
                        />
                    }
                </>
            ])}
        />

    </>
}
