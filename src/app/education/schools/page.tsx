import styles from './page.module.scss'
import { readSchoolsPageAction } from '@/services/education/schools/actions'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { SchoolPagingProvider } from '@/contexts/paging/SchoolPaging'
import SchoolList from '@/components/School/SchoolList'
import { ServerSession } from '@/auth/session/ServerSession'
import { schoolAuth } from '@/services/education/schools/auth'
import { schoolListRenderer } from '@/components/School/SchoolListRenderer'
import Link from 'next/link'
import type { PageSizeSchool } from '@/contexts/paging/SchoolPaging'

export default async function Schools() {
    const isSchoolAdmin = schoolAuth.create.dynamicFields({}).auth(await ServerSession.fromNextAuth()).authorized

    const pageSizeSchool: PageSizeSchool = 8
    const res = await readSchoolsPageAction({
        page: { pageSize: pageSizeSchool, page: 0, cursor: null },
        details: undefined,
    })
    if (!res.success) throw new Error(res.error?.length ? res.error[0].message : 'Ukjent feil')
    const serverRenderedData = res.data
    console.log(serverRenderedData)

    return (
        <PageWrapper title="Skoler" headerItem={
            isSchoolAdmin ? (
                <Link href="/admin/schools" className={styles.adminLink}>
                    Gå til administrasjon
                </Link>
            ) : <></>
        }>
            <SchoolPagingProvider
                serverRenderedData={serverRenderedData}
                details={undefined}
                startPage={{ pageSize: pageSizeSchool, page: 1 }}
            >
                <div className={styles.wrapper}>
                    <SchoolList serverRendered={serverRenderedData.map(schoolListRenderer(false))} />
                </div>
            </SchoolPagingProvider>
        </PageWrapper>
    )
}
