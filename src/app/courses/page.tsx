import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import { createCourseAction } from '@/actions/courses/create'

export default function Courses() {
    return (
        <PageWrapper title="Courses" headerItem={
            <AddHeaderItemPopUp PopUpKey="create-couses">
                <Form
                    action={createCourseAction}
                >
                    <TextInput label="Navn" name="name" />
                </Form>
            </AddHeaderItemPopUp>
        }>
            <div>hei</div>
        </PageWrapper>
    )
}
