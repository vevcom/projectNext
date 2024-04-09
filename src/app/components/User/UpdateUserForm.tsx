'use client'
import React, { useContext } from 'react'
import Form from '../Form/Form'
import { v4 as uuid } from 'uuid'
import { updateUserAction } from '@/actions/users/update'
import TextInput from '@/components/UI/TextInput'
import { useRouter } from 'next/navigation'
import { User } from "@prisma/client"
import { Proptypes } from '../UI/Select'
import styles from './UpdateUserForm.module.scss'
import Select from '@/components/UI/Select'

type PropTypes = {
    className?: string
    user: User
}

   


export default function UpdateUserForm({className, user} : PropTypes) {
    const { replace } = useRouter()
    const updateUserWithId = updateUserAction.bind(null, user.id)

     // TODO: refactor to server folder
     const sexOptions = [
        { value: 'FEMALE', label: 'Kvinne' },
        { value: 'MALE', label: 'Mann' },
        { value: 'OTHER', label: 'Annet' },
    ]


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
                <Select label="Kjønn" name = "sex" options={sexOptions} key={uuid()}/>
            </Form>
        </div>
  )
}

