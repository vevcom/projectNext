'use client'
import styles from './RegistrationsList.module.scss'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import EventRegistrationPagingProvider, { EventRegistrationPagingContext } from '@/contexts/paging/EventRegistrationPaging'
import UserCard from '@/components/User/UserCard'
import EventRegistrationDetailedPagingProvider, {
    EventRegistrationDetailedPagingContext
} from '@/contexts/paging/EventRegistrationDetailedPaging'
import UserDisplayName from '@/components/User/UserDisplayName'
import Slider from '@/components/UI/Slider'
import { useState } from 'react'
import Link from 'next/link'
import Form from '@/components/Form/Form'
import { bindParams } from '@/actions/bind'
import { eventRegistrationDestroyAction } from '@/actions/events/registration'


export default function RegistrationsList({
    eventId,
}: {
    eventId: number,
}) {
    const isAdmin = true // TODO: Fix the authing
    const [detailedView, setDetailedView] = useState(false)

    return <>
        <h4>Påmeldte</h4>
        {isAdmin && <Slider
            label="Detaljert visning"
            name="detailedView"
            onChange={e => setDetailedView(e.target.checked)}
            checked={detailedView}
        />}
        {detailedView ?
            <EventRegistrationDetailedPagingProvider
                serverRenderedData={[]}
                startPage={{
                    page: 0,
                    pageSize: 50
                }}
                details={{
                    eventId,
                }}
            >
                <div className={styles.RegistrationTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Navn</th>
                                <th>E-post</th>
                                <th>Allergier</th>
                                <th>Kommentar</th>
                                <th>Slett</th>
                            </tr>
                        </thead>
                        <tbody>
                            <EndlessScroll
                                pagingContext={EventRegistrationDetailedPagingContext}
                                renderer={row => <tr>
                                    <td>
                                        <Link href={`/users/${row.user.username}`}>
                                            <UserDisplayName user={row.user} />
                                        </Link>
                                    </td>
                                    <td>{row.user.email}</td>
                                    <td>{row.user.allergies}</td>
                                    <td>{row.note}</td>
                                    <td>
                                        <Form
                                            action={bindParams(eventRegistrationDestroyAction, { registrationId: row.id })}
                                            submitText="Slett"
                                            submitColor="red"
                                            confirmation={{
                                                confirm: true,
                                                text: 'Er du sikker på at du vil slette denne påmeldingen?'
                                            }}
                                        />
                                    </td>
                                </tr>}
                            />
                        </tbody>
                    </table>
                </div>
            </EventRegistrationDetailedPagingProvider> : <EventRegistrationPagingProvider
                serverRenderedData={[]}
                startPage={{
                    page: 0,
                    pageSize: 50
                }}
                details={{
                    eventId,
                }}
            >
                <div className={styles.RegistrationsList}>
                    <EndlessScroll
                        pagingContext={EventRegistrationPagingContext}
                        renderer={row => <UserCard user={row.user} className={styles.userCard} />}
                    />
                </div>
            </EventRegistrationPagingProvider>
        }
    </>
}
