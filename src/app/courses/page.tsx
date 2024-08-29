import { AddHeaderItemPopUp } from '../_components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '../_components/PageWrapper/PageWrapper'
import Form from '@/components/Form/Form'
import TextInput from '../_components/UI/TextInput'
import { createCourseAction } from '@/actions/courses/create'
import { create } from 'domain'

export default function Courses() {
    return (
        <PageWrapper title="Courses" headerItem={
            <AddHeaderItemPopUp>
                <Form
                    action={createCourseAction}
                >
                    <TextInput label="Navn" name="name" />
                </Form>
            </AddHeaderItemPopUp>
        }>

        </PageWrapper>
    )
}
