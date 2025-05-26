import styles from './page.module.scss'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readApplicationPeriodsAction } from '@/actions/applications/periods/read'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Date from '@/components/Date/Date'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'

export default async function Apllications() {
    const periods = unwrapActionReturn(await readApplicationPeriodsAction())

    return (
        <PageWrapper title="Søknadsperioder" headerItem={
            <AddHeaderItemPopUp PopUpKey="addApplicationPeriod">
                <Form
                    title="Legg til søknadsperiode"
                    action={}
                >
                    <TextInput name="name" label="Navn" ></TextInput>
                </Form>
            </AddHeaderItemPopUp>
        }>
            <div className={styles.wrapper}>
                <ol className={styles.periods}>
                    {periods.map((period) => (
                        <li key={period.name}>
                            <a href={`/applications/${period.name}`}>{period.name}</a>
                            <Date date={period.endDate} includeTime />
                        </li>
                    ))}
                </ol>
            </div>
        </PageWrapper>
    )
}
