import styles from './page.module.scss'
import { SchoolAdminList } from './SchoolAdminList'
import Form from '@/components/Form/Form'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { createSchoolAction, readSchoolsAction, readStandardSchoolsAction } from '@/education/schools/actions'
import TextInput from '@/components/UI/TextInput'

export default async function SchoolsAdmin() {
    const standardSchoolsRes = await readStandardSchoolsAction()
    if (!standardSchoolsRes.success) {
        throw new Error(standardSchoolsRes.error?.length ? standardSchoolsRes.error[0].message : 'Ukjent feil')
    }
    const standardSchools = standardSchoolsRes.data

    const schoolsRes = await readSchoolsAction({ onlyNonStandard: true })
    if (!schoolsRes.success) throw new Error(schoolsRes.error?.length ? schoolsRes.error[0].message : 'Ukjent feil')
    const schools = schoolsRes.data

    return (
        <PageWrapper title="Skoler" headerItem={
            <AddHeaderItemPopUp PopUpKey="CreateSchool">
                <Form
                    action={createSchoolAction}
                    refreshOnSuccess
                >
                    <TextInput label="Navn" name="name" />
                    <TextInput label="Kortnavn" name="shortName" />
                </Form>
            </AddHeaderItemPopUp>
        }>
            <div className={styles.wrapper}>
                <p>Skoler er brukt på fagveven</p>
                <h2>Standard Skoler</h2>
                <SchoolAdminList schools={standardSchools} />
                <h2>Andre Skoler</h2>
                <SchoolAdminList schools={schools} />
            </div>
        </PageWrapper>
    )
}
