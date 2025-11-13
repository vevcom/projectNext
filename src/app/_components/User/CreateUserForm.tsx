'use client'
import styles from './CreateUserForm.module.scss'
import { createUserAction } from '@/services/users/actions'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import React from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/navigation'

type PropTypes = {
    className?: string
}

export default function CreateUserForm({ className }: PropTypes) {
    const { refresh } = useRouter()

    return (
        <div className={`${styles.CreateUserForm} ${className}`}>
            <Form
                title="Lag en bruker"
                submitText="Lag bruker"
                action={createUserAction}
                successCallback={refresh}
            >
                <TextInput label="email" name="email" key={uuid()}/>
                <TextInput label="username" name="username" key={uuid()}/>
                <TextInput label="first name" name="firstname" key={uuid()}/>
                <TextInput label="last name" name="lastname" key={uuid()}/>
                <p>Når en bruker lages vil brukeren få tilsendt en epost, med en link for å fullføre registreringen.</p>
            </Form>
        </div>
    )
}
