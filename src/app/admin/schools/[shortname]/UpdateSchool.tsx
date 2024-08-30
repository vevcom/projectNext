'use client'
import Form from '@/app/_components/Form/Form'
import { updateSchoolAction } from '@/education/schools/update'
import TextInput from '@/components/UI/TextInput'
import type { SchoolFiltered } from '@/education/schools/Types'

type PropTypes = {
    school: SchoolFiltered
}

export default function UpdateSchool({ school }: PropTypes) {
    const updateAction = updateSchoolAction.bind(null, school.id)

    return (
        <Form
            submitText="Oppdater"
            action={updateAction}
            navigateOnSuccess={data => (data ? `/admin/schools/${data.shortname}` : '/admin/schools')}
        >
            <TextInput name="name" label="navn" defaultValue={school.name} />
            <TextInput name="shortname" label="kortnavn" defaultValue={school.shortname} />
        </Form>
    )
}
