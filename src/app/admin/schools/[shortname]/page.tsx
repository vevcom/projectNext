import styles from './page.module.scss'
import { readSchoolAction } from '@/actions/schools/read'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import School from '@/components/School/School'

type PropTypes = {
    params: {
        shortname: string
    }
}

export default async function SchoolAdmin({ params }: PropTypes) {
    const shortname = decodeURIComponent(params.shortname)
    const res = await readSchoolAction(shortname)
    if (!res.success) throw new Error(res.error?.length ? res.error[0].message : 'Unknown error')
    const school = res.data
    return (
        <PageWrapper title="Administrer skole">
            <span className={styles.preview}>
                <School school={school} />
            </span>
        </PageWrapper>
    )
}
