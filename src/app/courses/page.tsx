import { AddHeaderItemPopUp } from "../_components/HeaderItems/HeaderItemPopUp";
import PageWrapper from "../_components/PageWrapper/PageWrapper";
import Form from "@/components/Form/Form";

export default function Courses() {
    return (
        <PageWrapper title="Courses" headerItem={
            <AddHeaderItemPopUp>
                <Form
                    
                >
                    <TextInput label="Navn" name="name" />
                </Form>
            </AddHeaderItemPopUp>
        }>

        </PageWrapper>
    )
}