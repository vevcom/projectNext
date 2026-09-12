import styles from './page.module.scss'
import CreateUpdateApplicationPeriodForm from './CreateUpdateApplicationPeriodForm'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readApplicationPeriodsAction } from '@/services/applications/periods/actions'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Date from '@/components/Date/Date'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readAllCommitteesAction } from '@/services/groups/committees/actions'

export default async function Applications() {
    const periods = unwrapActionReturn(await readApplicationPeriodsAction())
    const committees = unwrapActionReturn(await readAllCommitteesAction())

    return (
        <PageWrapper title="Søknadsperioder" headerItem={
            <AddHeaderItemPopUp popUpKey="addApplicationPeriod">
                <CreateUpdateApplicationPeriodForm committees={committees} closePopUpOnSuccess="addApplicationPeriod" />
            </AddHeaderItemPopUp>
        }>
            <div className={styles.periods}>
                {periods.map((period) => (
                    <div key={period.name}>
                        <a href={`/applications/${period.name}`}>{period.name}</a>
                        <Date date={period.endDate} includeTime />
                    </div>
                ))}
            </div>
        </PageWrapper>
    )
}
