import { readSchoolsPageAction } from '@/actions/education/schools/read'
import styles from './page.module.scss'
import { getUser } from '@/auth/getUser'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import SchoolPagingProvider, { PageSizeSchool } from '@/contexts/paging/SchoolPaging'
import Link from 'next/link'
import SchoolList from '@/components/School/SchoolList'
import { schoolListRenderer } from '@/components/School/SchoolListRenderer'

export default async function Schools() {
    const { permissions } = await getUser()

    const isSchoolAdmin = permissions.includes('SCHOOLS_ADMIN')

    const pageSizeSchool : PageSizeSchool = 8
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
