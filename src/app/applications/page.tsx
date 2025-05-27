import styles from './page.module.scss'
import CreateUpdateApplicationPeriodForm from './CreateUpdateApplicationPeriodForm'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readApplicationPeriodsAction } from '@/actions/applications/periods/read'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Date from '@/components/Date/Date'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import { readCommitteesAction } from '@/actions/groups/committees/read'

export default async function Apllications() {
    const periods = unwrapActionReturn(await readApplicationPeriodsAction())
    const committees = unwrapActionReturn(await readCommitteesAction())

    return (
        <PageWrapper title="Søknadsperioder" headerItem={
            <AddHeaderItemPopUp PopUpKey="addApplicationPeriod">
                <CreateUpdateApplicationPeriodForm committees={committees} closePopUpOnSuccess="addApplicationPeriod" />
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
