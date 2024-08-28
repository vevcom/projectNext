import styles from './page.module.scss'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import UserList from '@/components/User/UserList/UserList'
import CreateUserForm from '@/components/User/CreateUserForm'
import UserPagingProvider from '@/contexts/paging/UserPaging'

export default async function Users() {
    return (
        <PageWrapper title="Brukere" headerItem={
            <AddHeaderItemPopUp PopUpKey="createUser">
                <CreateUserForm className={styles.makeUser} />
            </AddHeaderItemPopUp>
        }>
            <div className={styles.wrapper}>
                <UserPagingProvider
                    serverRenderedData={[]}
                    startPage={{
                        pageSize: 50,
                        page: 0,
                    }}
                    details={{
                        groups: [],
                        partOfName: ''
                    }}
                >
                    <UserList />
                </UserPagingProvider>
            </div>
        </PageWrapper>

    )
}
