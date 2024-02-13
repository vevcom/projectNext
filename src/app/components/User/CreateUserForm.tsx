'use client'

import React from 'react'
import { createUser } from '@/actions/users/create'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import { v4 as uuid } from 'uuid'
import styles from './CreateUserForm.module.scss'
import { useRouter } from 'next/navigation'

export default function CreateUserForm() {
    const { refresh } = useRouter()

    return (
        <div className={styles.CreateUserForm}>
            <Form 
                title="Lag en bruker" 
                submitText="Create user" 
                action={createUser} 
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
