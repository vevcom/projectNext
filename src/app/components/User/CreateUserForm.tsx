'use client'
import styles from './CreateUserForm.module.scss'
import { createUserAction } from '@/actions/users/create'
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
                submitText="Create user"
                action={createUserAction}
                successCallback={refresh}
            >
                <TextInput label="username" name="username" key={uuid()}/>
                <TextInput label="password" name="password" key={uuid()}/>
                <TextInput label="confirm password" name="confirmPassword" key={uuid()}/>
                <TextInput label="email" name="email" key={uuid()}/>
                <TextInput label="first name" name="firstname" key={uuid()}/>
                <TextInput label="last name" name="lastname" key={uuid()}/>
            </Form>
        </div>
    )
}
