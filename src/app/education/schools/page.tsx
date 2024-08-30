import styles from './page.module.scss'
import { getUser } from '@/auth/getUser'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Link from 'next/link'

export default async function Schools() {
    const { permissions } = await getUser()

    const isSchoolAdmin = permissions.includes('SCHOOLS_ADMIN')

    return (
        <PageWrapper title="Skoler" headerItem={
            isSchoolAdmin ? (
                <Link href="/admin/schools" className={styles.adminLink}>
                    Gå til administrasjon
                </Link>
            ) : <></>
        }>
            <p>Dette er en liste skole. Du er velkommen til å legge til flere</p>
        </PageWrapper>
    )
}
