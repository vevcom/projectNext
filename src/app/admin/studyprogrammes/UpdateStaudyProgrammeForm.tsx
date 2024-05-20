"use client"

import Form from "@/app/components/Form/Form";
import Select from "@/app/components/UI/Select";
import TextInput from "@/app/components/UI/TextInput";
import { StudyProgramme } from "@prisma/client";



export default function UpdateStudyProgrammeForm({
    studyProgram,
}: {
    studyProgram?: StudyProgramme
}) {

    const create = studyProgram === undefined

    return <Form
        title={`${create ? "Legg til" : "Oppdater"} studieprogram`}
        submitText={create ? "Legg til" : "Oppdater"}
    >
        <TextInput name="name" label="Navn" defaultValue={studyProgram?.name ?? ""}/>
        <TextInput name="code" label="Kode" defaultValue={studyProgram?.code ?? ""} />
        <TextInput name="insititueCode" label="Institutt kode" defaultValue={studyProgram?.insititueCode ?? ""} />
        <TextInput name="startYear" label="Start år" defaultValue={studyProgram?.startYear ?? ""} />
        <TextInput name="yearsLength" label="Studiets lengde" defaultValue={studyProgram?.yearsLength ?? ""} />
        <Select label="Del av Omega" name="partOfOmega" options={[
            {value: "false", label: "Nei"},
            {value: "true", label: "Ja"},
        ]} defaultValue={studyProgram?.partOfOmega ? "true" : "false"} />

    </Form>
}