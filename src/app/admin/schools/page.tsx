import styles from './page.module.scss'
import { SchoolAdminList } from './SchoolAdminList'
import Form from '@/components/Form/Form'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { createSchoolAction } from '@/actions/schools/create'
import TextInput from '@/app/_components/UI/TextInput'
import { readSchoolsAction, readStandardSchoolsAction } from '@/actions/schools/read'
import React from 'react'

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
                    <TextInput label="Kortnavn" name="shortname" />
                </Form>
            </AddHeaderItemPopUp>
        }>
            <div className={styles.wrapper}>
                <p>Skoler er brukt i emnesystemet</p>
                <h2>Standard Skoler</h2>
                <SchoolAdminList schools={standardSchools} />
                <h2>Andre Skoler</h2>
                <SchoolAdminList schools={schools} />
            </div>
        </PageWrapper>
    )
}
