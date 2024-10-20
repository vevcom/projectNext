import { createCompanyAction } from '@/actions/career/companies/create';
import Form from '@/components/Form/Form';
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp';
import TextInput from '@/components/UI/TextInput';
import PageWrapper from '@/components/PageWrapper/PageWrapper';

export default function page() {
    return (
        <PageWrapper title="Bedrifter" headerItem={
            <AddHeaderItemPopUp PopUpKey="CreateCompany">
                <Form
                    title="Ny bedrift"
                    action={createCompanyAction.bind(null, {})}
                    refreshOnSuccess
                    closePopUpOnSuccess="CreateCompany"
                    submitText="Lag"
                >
                    <TextInput name="name" label="Navn" />
                    <TextInput name="description" label="Beskrivelse" />
                </Form>
            </AddHeaderItemPopUp>
        }>
            <></>
        </PageWrapper>
    )
}
