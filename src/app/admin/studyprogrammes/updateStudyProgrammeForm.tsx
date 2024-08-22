'use client'

import { createStudyProgrammeAction } from '@/actions/groups/studyProgrammes/create'
import { updateStudyProgrammeAction } from '@/actions/groups/studyProgrammes/update'
import Form from '@/app/components/Form/Form'
import { SelectString } from '@/app/components/UI/Select'
import TextInput from '@/app/components/UI/TextInput'
import { useRouter } from 'next/navigation'
import type { StudyProgramme } from '@prisma/client'


export default function UpdateStudyProgrammeForm({
    studyProgramme,
}: {
    studyProgramme?: StudyProgramme
}) {
    const { refresh } = useRouter()

    const create = studyProgramme === undefined

    return <Form
        title={`${create ? 'Legg til' : 'Oppdater'} studieprogram`}
        submitText={create ? 'Legg til' : 'Oppdater'}
        action={create ? createStudyProgrammeAction : updateStudyProgrammeAction.bind(null, studyProgramme.id)}
        successCallback={true ? () => {} : refresh}
    >
        <TextInput name="name" label="Navn" defaultValue={studyProgramme?.name ?? ''}/>
        <TextInput name="code" label="Kode" defaultValue={studyProgramme?.code ?? ''} />
        <TextInput name="insititueCode" label="Institutt kode" defaultValue={studyProgramme?.insititueCode ?? ''} />
        <TextInput name="startYear" label="Start år" defaultValue={studyProgramme?.startYear ?? ''} />
        <TextInput name="yearsLength" label="Studiets lengde" defaultValue={studyProgramme?.yearsLength ?? ''} />
        <SelectString label="Del av Omega" name="partOfOmega" options={[
            { value: 'false', label: 'Nei' },
            { value: 'true', label: 'Ja' },
        ]} defaultValue={studyProgramme?.partOfOmega ? 'true' : 'false'} />

    </Form>
}
