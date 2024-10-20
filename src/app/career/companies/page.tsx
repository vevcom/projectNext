import { createCompanyAction } from '@/actions/career/companies/create';
import Form from '@/app/_components/Form/Form';
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp';
import TextInput from '@/app/_components/UI/TextInput';
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
