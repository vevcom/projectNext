import styles from './page.module.scss'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readApplicationPeriodsAction } from '@/actions/applications/periods/read'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Date from '@/components/Date/Date'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import { createApplicationPeriodAction } from '@/actions/applications/periods/create'
import DateInput from '@/components/UI/DateInput'
import { readCommitteesAction } from '@/actions/groups/committees/read'
import Checkbox from '@/components/UI/Checkbox'

export default async function Apllications() {
    const periods = unwrapActionReturn(await readApplicationPeriodsAction())
    const committees = unwrapActionReturn(await readCommitteesAction())

    return (
        <PageWrapper title="Søknadsperioder" headerItem={
            <AddHeaderItemPopUp PopUpKey="addApplicationPeriod">
                <Form
                    title="Legg til søknadsperiode"
                    action={createApplicationPeriodAction}
                    submitText="Legg til"
                    refreshOnSuccess
                    className={styles.createForm}
                >
                    <TextInput name="name" label="Navn" />
                    <DateInput name="startDate" label="Starttid" />
                    <DateInput name="endDate" label="Sluttid" />
                    <h3>Kommitéer som deltar i søknadsperioden</h3>
                    {
                        committees.map(committee => (
                            <Checkbox
                                key={committee.id}
                                name="participatingCommitteeIds"
                                value={committee.id}
                                label={committee.name}
                            />
                        ))
                    }
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
