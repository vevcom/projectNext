import Form from '@/components/Form/Form'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import React from 'react'
import { createSchoolAction } from '@/actions/schools/create'
import TextInput from '@/app/_components/UI/TextInput'

function SchoolsAdmin() {
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
            <p>Skoler er brukt i emnesystemet</p>
        </PageWrapper>
    )
}

export default SchoolsAdmin