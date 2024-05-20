"use client"

import Form from "@/app/components/Form/Form";
import Select from "@/app/components/UI/Select";
import TextInput from "@/app/components/UI/TextInput";



export default function UpdateStudyProgrammeForm() {



    return <Form
        title="Legg til studieprogram"
        submitText="Legg til"
    >
        <TextInput name="name" label="Navn" />
        <TextInput name="code" label="Kode" />
        <TextInput name="insititueCode" label="Institutt kode" />
        <TextInput name="startYear" label="Start år" />
        <TextInput name="yearsLength" label="Studiets lengde" />
        <Select label="Del av Omega" name="partOfOmega" options={[
            {value: false, label: "Nei"},
            {value: true, label: "Ja"},
        ]} />

    </Form>
}