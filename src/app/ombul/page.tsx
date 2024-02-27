import PageWrapper from '../components/PageWrapper/PageWrapper';
import styles from './page.module.scss';

export default function page() {
    return (
        <PageWrapper
            title="Ombul"
            headerItem={
                <div>headerItem</div>
            }
        >
            <div className={styles.wrapper}>
                hei
            </div>
        </PageWrapper>
    )
}
