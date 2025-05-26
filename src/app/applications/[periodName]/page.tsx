import styles from './page.module.scss'
import { readApplicationPeriodAction } from '@/actions/applications/periods/read'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import Date from '@/components/Date/Date'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import CountDown from '@/components/countDown/CountDown'
import Link from 'next/link'
import { readSpecialImageAction } from '@/images/read'
import BackdropImage from '@/components/BackdropImage/BackdropImage'
import CmsParagraph from '@/components/Cms/CmsParagraph/CmsParagraph'
import PopUp from '@/components/PopUp/PopUp'
import { readApplicationsForUserAction } from '@/actions/applications/read'
import { Session } from '@/auth/Session'

export type PropTypes = {
    params: {
        periodName: string
    }
}

export default async function ApplicationPeriod({ params }: PropTypes) {
    const period = unwrapActionReturn(await readApplicationPeriodAction({ name: params.periodName }))
    const defaultCommitteeLogo = unwrapActionReturn(await readSpecialImageAction({ special: 'DAFAULT_COMMITTEE_LOGO' }))
    const userId = (await Session.fromNextAuth()).user?.id
    const applications = userId ? unwrapActionReturn(
        await readApplicationsForUserAction({ userId, periodId: period.id })
    ) : []

    return (
        <PageWrapper title={`Søknadsperiode: ${params.periodName}`}>
            <p>
                <Date date={period.startDate} includeTime />
                {' - '}
                <Date date={period.endDate} includeTime />
            </p>
            <div className={styles.countDown}>
                <Link href={`/applications/${period.name}/countdown`}>
                    <CountDown referenceDate={period.endDate} />
                </Link>
            </div>
            <ul className={styles.committees}>
                {
                    period.committeesParticipating
                        .map(part => part.committee)
                        .map(committee => (
                            <li key={committee.id}>
                                <BackdropImage
                                    image={committee.logoImage?.image ?? defaultCommitteeLogo}
                                    imageSize={230}
                                >
                                    <h1>{committee.name}</h1>
                                    <CmsParagraph
                                        cmsParagraph={committee.paragraph}
                                    />
                                    {/* TODO: Video saved on committee */}
                                    <div className={styles.navigation}>
                                        <PopUp
                                            PopUpKey={`committee-${committee.shortName}-apply`}
                                            showButtonContent={<span>Søk Nå!</span>}
                                            showButtonClass={styles.applyButton}
                                        >
                                            <h1>Søknad til {committee.name}</h1>
                                        </PopUp>
                                        <Link
                                            href={`/committees/${committee.shortName}`}
                                            className={styles.committeeLink}
                                        >
                                            Les mer
                                        </Link>
                                    </div>
                                </BackdropImage>
                            </li>
                        ))
                }
            </ul>
        </PageWrapper>
    )
}
