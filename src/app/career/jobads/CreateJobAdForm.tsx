'use client'
import styles from './CreateJobAdForm.module.scss'
import { createJobAdAction } from '@/actions/career/jobAds/create'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import React from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/navigation'
import { SelectString } from '@/app/_components/UI/Select'
import { JobTypeOptions } from '@/services/career/jobAds/ConfigVars'
import DateInput from '@/app/_components/UI/DateInput'

export default function CreateJobAdForm() {
    const { refresh } = useRouter()

    return (
        <div className={`${styles.CreateJobAdForm}`}>
            <Form
                title="Lag en ny stillingsannonse"
                submitText="Opprett"
                action={createJobAdAction.bind(null, {})}
                successCallback={refresh}
            >
                <TextInput label="Tittel" name="articleName" key={uuid()}/>
                <TextInput label="Bedrift" name="company" key={uuid()}/>
                <TextInput label="Beskrivelse" name="description" key={uuid()}/>
                <SelectString options={JobTypeOptions} label="Type" name="type" key={uuid()}/>
                <DateInput label="Søknadsfrist" name="applicationDeadline" key={uuid()}/>
            </Form>
        </div>
    )
}
