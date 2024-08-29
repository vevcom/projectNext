import Form from '@/components/Form/Form'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import React from 'react'
import { createSchoolAction } from '@/actions/schools/create'

function SchoolsAdmin() {
    return (
        <PageWrapper title="Skoler" headerItem={
            <AddHeaderItemPopUp>
                <Form
                    action={createSchoolAction}
                >

                </Form>
            </AddHeaderItemPopUp>
        }>
            <p>Skoler er brukt i emnesystemet</p>
        </PageWrapper>
    )
}

export default SchoolsAdmin