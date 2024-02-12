import styles from './page.module.scss';
import PageWrapper from '../components/PageWrapper/PageWrapper';

export default function JobAds() {
    return (
        <PageWrapper title="Job ads">
            <div className={styles.wrapper}>
                job ad
            </div>
        </PageWrapper>
        
    );
}