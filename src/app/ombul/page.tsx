import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageWrapper from '../components/PageWrapper/PageWrapper';
import styles from './page.module.scss';
import AddHeaderItemPopUp from '../components/AddHeaderItem/AddHeaderItemPopUp';

export default function page() {
    return (
        <PageWrapper
            title="Ombul"
            headerItem={
                <AddHeaderItemPopUp PopUpKey="create ombul">
                    hei
                </AddHeaderItemPopUp>
            }
        >
            <div className={styles.wrapper}>
                hei
            </div>
        </PageWrapper>
    )
}
