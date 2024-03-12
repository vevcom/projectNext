import React from 'react'
import styles from './page.module.scss'
import UpdateUserForm from '@/app/components/User/UpdateUserForm'
import { readUser } from '@/actions/users/read'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: {
        username: string
    },
}

export default async function editUser({params }: PropTypes) {
    const userRes = (await readUser(params))
    if (!userRes.success) {
        notFound()
    }
    const user = userRes.data

    return (
        <div className={styles.wrapper}>
            <UpdateUserForm
                user = {user}
            />
    </div>
  )
}
