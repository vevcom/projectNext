import LockerIdForm from './LockerIdForm'
import LockerList from './LockerList'
import QRButton from './QRButton'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { getUser } from '@/auth/getUser'
import LockerPagingProvider from '@/contexts/paging/LockerPaging'

export default async function Lockers() {
    await getUser({
        userRequired: true,
        shouldRedirect: true,
        requiredPermissions: [['LOCKER_READ']],
    })

    return (
        <PageWrapper title="Skap">
            <LockerIdForm />
            <br/>
            <QRButton />

            <h2>Skapliste</h2>
            <LockerPagingProvider
                startPage={{
                    pageSize: 20,
                    page: 0
                }}
                details={undefined}
                serverRenderedData={[]}
            >
                <LockerList />
            </LockerPagingProvider>
        </PageWrapper>
    )
}
