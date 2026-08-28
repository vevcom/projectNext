import styles from './page.module.scss'
import CreateCommitteeForm from './CreateCommitteeForm'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { committeeAuth } from '@/services/groups/committees/auth'
import { ServerSession } from '@/auth/session/ServerSession'

export default async function AdminCommittee() {
    committeeAuth.create.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).redirectOnUnauthorized({ returnUrl: '/admin/committees' })

    return (
        <PageWrapper title="Opprett komité">
            <div className={styles.wrapper}>
                <CreateCommitteeForm />
            </div>
        </PageWrapper>
    )
}
