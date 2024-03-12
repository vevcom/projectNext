'use client'
import React from 'react'
import Form from '../Form/Form'
import { v4 as uuid } from 'uuid'
import { updateUser } from '@/actions/users/update'
import TextInput from '@/components/UI/TextInput'
import { useRouter } from 'next/navigation'
import { User } from "@prisma/client"
import { Proptypes } from '../UI/Select'
import styles from './UpdateUserForm.module.scss'

type PropTypes = {
    className?: string
    user: User
}


export default function UpdateUserForm({className, user} : PropTypes) {
    const { replace } = useRouter()
    const updateUserWithId = updateUser.bind(null, user.id)
    return (
        <div className={`${styles.UpdateUserForm} ${className}`}>
            <Form
                title="Oppdater bruker"
                submitText='Update user'
                action={updateUserWithId}
                successCallback={(data) => {
                    if(data) {
                        replace(`/users/${data.username}/edit`)
                    }
                }}
                
            >
                <TextInput label="Brukernavn" name="username"  defaultValue = {user.username} key={uuid()}/>
                <TextInput label="E-post" name="email" defaultValue = {user.email} key={uuid()}/>
                <TextInput label="Fornavn" name = "firstname" defaultValue = {user.firstname} key={uuid()}/>
                <TextInput label="Etternavn" name = "lastname" defaultValue = {user.lastname} key={uuid()}/>
            </Form>
        </div>
  )
}

