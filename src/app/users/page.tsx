import styles from './page.module.scss';
import UserList from '@/components/User/UserList/UserList';
import PageWrapper from '../components/PageWrapper/PageWrapper';
import PopUp from '@/components/PopUp/PopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CreateUserForm from '@/components/User/CreateUserForm';

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
                <UserList />
            </div>
        </PageWrapper>
        
    )
}