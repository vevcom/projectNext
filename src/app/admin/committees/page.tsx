import styles from './page.module.scss'
import CreateCommitteeForm from './CreateCommitteeForm'
import PageWrapper from '@/components/PageWrapper/PageWrapper'

export default function AdminCommittee() {
    return (
        <PageWrapper title="Opprett komité">
            <div className={styles.wrapper}>
                <CreateCommitteeForm />
            </div>
        </PageWrapper>
    )
}
