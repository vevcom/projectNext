'use client'
import styles from './CreateJobAdForm.module.scss'
import { createJobAdAction } from '@/actions/career/jobAds/create'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import React from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/navigation'

export default function CreateJobAdForm() {
    const { refresh } = useRouter()

    return (
        <div className={`${styles.CreateJobAdForm}`}>
            <Form
                title="Lag en ny stillingsannonse"
                submitText="Create job ad"
                action={createJobAdAction}
                successCallback={refresh}
            >
                <TextInput label="Tittel" name="articleName" key={uuid()}/>
                <TextInput label="Bedrift" name="company" key={uuid()}/>
                <TextInput label="Beskrivelse" name="description" key={uuid()}/>
            </Form>
        </div>
    )
}
