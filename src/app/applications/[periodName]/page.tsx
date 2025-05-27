import styles from './page.module.scss'
import { readApplicationPeriodAction } from '@/actions/applications/periods/read'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { default as DateComponent } from '@/components/Date/Date'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import CountDown from '@/components/countDown/CountDown'
import Link from 'next/link'
import { readSpecialImageAction } from '@/images/read'
import BackdropImage from '@/components/BackdropImage/BackdropImage'
import CmsParagraph from '@/components/Cms/CmsParagraph/CmsParagraph'
import PopUp from '@/components/PopUp/PopUp'
import { readApplicationsForUserAction } from '@/actions/applications/read'
import { Session } from '@/auth/Session'
import Textarea from '@/components/UI/Textarea'
import Form from '@/components/Form/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { createApplicationAction } from '@/actions/applications/create'
import { updateApplicationAction } from '@/actions/applications/update'

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

    const periodWithApplications = {
        ...period,
        committeesParticipating: period.committeesParticipating.map(part => ({
            ...part,
            priority: applications.find(
                application => application.applicationPeriodCommiteeId === part.id
            )?.priority ?? null,
            text: applications.find(
                application => application.applicationPeriodCommiteeId === part.id
            )?.text ?? ''
        })).toSorted((a, b) => {
            if (a.priority === null && b.priority === null) return 0
            if (a.priority === null) return 1
            if (b.priority === null) return -1
            return a.priority - b.priority
        })
    }

    return (
        <PageWrapper title={`Søknadsperiode: ${params.periodName}`}>
            <p>
                Søknadsstart: <DateComponent date={period.startDate} includeTime />
                <br />
                Søknadsfrist: <DateComponent date={period.endDate} includeTime />
                <br />
                Frist for prioritering: <DateComponent date={period.endPriorityDate} includeTime />
            </p>
            {
                period.endDate.getTime() > (new Date()).getTime() && (
                    <div className={styles.countDown}>
                        <Link href={`/applications/${period.name}/countdown`}>
                            <CountDown referenceDate={period.endDate} />
                        </Link>
                    </div>
                )
            }
            <ul className={styles.committees}>
                {
                    periodWithApplications.committeesParticipating
                        .map(part => (
                            <li key={part.committee.id}>
                                <BackdropImage
                                    image={part.committee.logoImage?.image ?? defaultCommitteeLogo}
                                    imageSize={230}
                                >
                                    <h1>{part.committee.name}</h1>
                                    <CmsParagraph
                                        cmsParagraph={part.committee.paragraph}
                                    />
                                    {/* TODO: Video saved on committee */}
                                    <div className={styles.navigation}>
                                        {
                                            userId && (
                                                <PopUp
                                                    PopUpKey={`committee-${part.committee.shortName}-apply`}
                                                    showButtonContent={
                                                        <span>{part.priority === null ? 'Søk nå!' : 'Endre søknad'}</span>
                                                    }
                                                    showButtonClass={styles.applyButton}
                                                >
                                                    <h1>Søknad til {part.committee.name}</h1>
                                                    <Form
                                                        action={part.priority === null ?
                                                            createApplicationAction.bind(
                                                                null, { userId, commiteeParticipationId: part.id }
                                                            ) : updateApplicationAction.bind(
                                                                null, { userId, commiteeParticipationId: part.id }
                                                            )
                                                        }
                                                        submitText={part.priority === null ? 'Send søknad' : 'Endre søknad'}
                                                    >
                                                        <Textarea
                                                            name="text"
                                                            label="Søknadstekst"
                                                            defaultValue={part.text}
                                                        />
                                                    </Form>
                                                </PopUp>
                                            )
                                        }
                                        <Link
                                            href={`/committees/${part.committee.shortName}`}
                                            className={styles.committeeLink}
                                        >
                                            Les mer
                                        </Link>
                                    </div>
                                    {
                                        part.priority !== null && (
                                            <div className={styles.priority}>
                                                <p>{part.priority}</p>
                                                <FontAwesomeIcon icon={faArrowUp} />
                                                <FontAwesomeIcon icon={faArrowDown} />
                                            </div>
                                        )
                                    }
                                </BackdropImage>
                            </li>
                        ))
                }
            </ul>
        </PageWrapper>
    )
}
