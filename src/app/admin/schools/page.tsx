import Form from '@/components/Form/Form'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import React from 'react'
import { createSchoolAction } from '@/actions/schools/create'
import TextInput from '@/app/_components/UI/TextInput'
import styles from './page.module.scss'
import { readSchoolsAction, readStandardSchoolsAction } from '@/actions/schools/read'
import { SchoolAdminList } from './SchoolAdminList'

export default async function SchoolsAdmin() {
    const standardSchoolsRes = await readStandardSchoolsAction()
    if (!standardSchoolsRes.success) throw new Error(standardSchoolsRes.error?.length ? standardSchoolsRes.error[0].message : 'Ukjent feil')
    const standardSchools = standardSchoolsRes.data

    const schoolsRes = await readSchoolsAction()
    if (!schoolsRes.success) throw new Error(schoolsRes.error?.length ? schoolsRes.error[0].message : 'Ukjent feil')
    const schools = schoolsRes.data

    return (
        <PageWrapper title="Skoler" headerItem={
            <AddHeaderItemPopUp PopUpKey="CreateSchool">
                <Form
                    action={createSchoolAction}
                >
                    <TextInput label="Navn" name="name" />
                    <TextInput label="Kortnavn" name="shortname" />
                </Form>
            </AddHeaderItemPopUp>
        }>
            <div className={styles.wrapper}>
                <p>Skoler er brukt i emnesystemet</p>
                <SchoolAdminList schools={standardSchools} />
                <SchoolAdminList schools={schools} />
            </div>
        </PageWrapper>
    )
}
