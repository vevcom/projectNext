import PageWrapper from '@/components/PageWrapper/PageWrapper'
import LockerList from './LockerList'
import LockerPagingProvider from '@/context/paging/LockerPaging'
import { getUser } from '@/auth/getUser'
import QRButton from './QRButton'

export default async function Lockers() {
    await getUser({
        userRequired: true,
        shouldRedirect: true,
        requiredPermissions: [['LOCKER_READ']],
    })

    return (
        <>
            <QRButton />

            <PageWrapper title="Skap">
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
        </>
        
    )
}
