'use client'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import UserDisplayName from '@/components/User/UserDisplayName'
import EventRegistrationPagingProvider, { EventRegistrationPagingContext } from '@/contexts/paging/EventRegistrationPaging'
import styles from './RegistrationsList.module.scss'


export default function RegistrationsList() {
    return <EventRegistrationPagingProvider
        serverRenderedData={[]}
        startPage={{
            page: 0,
            pageSize: 50
        }}
        details={[]}
    >
        <div className={styles.RegistrationsList}>
            <EndlessScroll
                pagingContext={EventRegistrationPagingContext}
                renderer={row => <div>
                    <UserDisplayName user={row.user} />
                </div>}
            />
        </div>
    </EventRegistrationPagingProvider>
}
