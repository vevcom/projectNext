import styles from './page.module.scss'
import UpdateSchool from './UpdateSchool'
import { destroySchoolAction } from '@/education/schools/destroy'
import { readSchoolAction } from '@/education/schools/read'
import Form from '@/app/_components/Form/Form'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
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
            <UpdateSchool school={school} />
            <div className={styles.preview}>
                <School school={school} />
            </div>
            <Form
                action={destroySchoolAction.bind(null, school.id)}
                navigateOnSuccess="/admin/schools"
                refreshOnSuccess
                submitText="Slett"
                submitColor="red"
                confirmation={{
                    confirm: true,
                    text: 'Er du sikker på at du vil slette denne skolen? De vil også slette alle emner til denne skolen.'
                }}
            />
        </PageWrapper>
    )
}
