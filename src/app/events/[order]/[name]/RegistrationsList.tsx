'use client'
import styles from './RegistrationsList.module.scss'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import EventRegistrationPagingProvider, { EventRegistrationPagingContext } from '@/contexts/paging/EventRegistrationPaging'
import UserCard from '@/components/User/UserCard'


export default function RegistrationsList({
    eventId,
}: {
    eventId: number,
}) {
    return <EventRegistrationPagingProvider
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
