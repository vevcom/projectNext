import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { schoolAuth } from '@/services/education/schools/auth'
import { ServerSession } from '@/auth/session/ServerSession'

export default async function CoursesAdmin() {
    schoolAuth.create.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).redirectOnUnauthorized({ returnUrl: '/admin/courses' })

    return (
        <PageWrapper title="Emnekatalog">
            <h1>Emnene</h1>
        </PageWrapper>
    )
}
