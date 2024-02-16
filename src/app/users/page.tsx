import styles from './page.module.scss';
import UserList from '@/components/User/UserList/UserList';
import PageWrapper from '../components/PageWrapper/PageWrapper';
import PopUp from '@/components/PopUp/PopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CreateUserForm from '@/components/User/CreateUserForm';
import UserPagingProvider from '@/context/paging/UserPaging';

export default async function Users() {
    return (
        <PageWrapper title="Brukere" headerItem={
            <PopUp 
                PopUpKey="userListAdd"
                showButtonClass={styles.addUserButton}
                showButtonContent = {
                    <FontAwesomeIcon className={styles.addIcon} icon={faPlus} />
                }
            >
                <CreateUserForm />
            </PopUp>
        }>
            <div className={styles.wrapper}>
                <UserPagingProvider
                    serverRenderedData={[]}
                    startPage={{
                        pageSize: 50,
                        page: 0
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