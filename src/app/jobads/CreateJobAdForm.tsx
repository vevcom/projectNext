'use client'
import styles from './CreateJobAdForm.module.scss'
import { createJobAdAction } from '@/actions/jobAds/create'
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
                title="Create a job ad"
                submitText="Create job ad"
                action={createJobAdAction}
                successCallback={refresh}
            >
                <TextInput label="title" name="articleName" key={uuid()}/>
                <TextInput label="company" name="company" key={uuid()}/>
                <TextInput label="description" name="description" key={uuid()}/>
            </Form>
        </div>
    )
}