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
import { EventRegistrationConfig } from '@/services/events/registration/config'
import { EventFiltered } from '@/services/events/Types'
import ContactCard from '@/components/User/ContactCard'

function DetailedTable({
    event,
    type,
}: {
    event: EventFiltered,
    type: EventRegistrationConfig.REGISTRATION_READER_TYPE
}) {
    return <EventRegistrationDetailedPagingProvider
        serverRenderedData={[]}
        startPage={{
            page: 0,
            pageSize: 50
        }}
        details={{
            eventId: event.id,
            type,
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
                        renderer={row => {
                            const name = row.user ? <Link href={`/users/${row.user.username}`}>
                                <UserDisplayName user={row.user} />
                            </Link> : row.contact?.name
                            return <tr key={row.id}>
                                <td>{name}</td>
                                <td>{row.user ? row.user.email : row.contact?.email}</td>
                                <td>{row.user ? row.user.allergies : 'Ukjent'}</td>
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
                            </tr>
                        }}
                    />
                </tbody>
            </table>
        </div>
    </EventRegistrationDetailedPagingProvider>
}

function DefaultList({
    event,
    type,
}: {
    event: EventFiltered,
    type: EventRegistrationConfig.REGISTRATION_READER_TYPE
}) {
    return <EventRegistrationPagingProvider
        serverRenderedData={[]}
        startPage={{
            page: 0,
            pageSize: 50
        }}
        details={{
            eventId: event.id,
            type,
        }}
    >
        <div className={styles.RegistrationsList}>
            <EndlessScroll
                pagingContext={EventRegistrationPagingContext}
                renderer={(row, i) => {
                    if (row.user) {
                        return <UserCard key={i} user={{
                            ...row.user,
                            image: row.image
                        }} className={styles.userCard} />
                    }
                    return <ContactCard key={i} name={row.contact?.name ?? 'Ukjent'} image={row.image} />
                }}
            />
        </div>
    </EventRegistrationPagingProvider>
}

export default function RegistrationsList({
    event,
}: {
    event: EventFiltered,
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
        {detailedView ? <DetailedTable
            event={event}
            type={EventRegistrationConfig.REGISTRATION_READER_TYPE.REGISTRATIONS}
        /> : <DefaultList
            event={event}
            type={EventRegistrationConfig.REGISTRATION_READER_TYPE.REGISTRATIONS}
        />}

        {event.waitingList && <>
            <h4>Venteliste</h4>
            {detailedView ? <DetailedTable
                event={event}
                type={EventRegistrationConfig.REGISTRATION_READER_TYPE.WAITING_LIST}
            /> : <DefaultList
                event={event}
                type={EventRegistrationConfig.REGISTRATION_READER_TYPE.WAITING_LIST}
            />}
        </>}
    </>
}
