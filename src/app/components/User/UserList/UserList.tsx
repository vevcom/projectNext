'use client'
import styles from './UserList.module.scss'
import { UserPagingContext } from '@/context/paging/UserPaging'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import UserRow from '@/components/User/UserRow'
import { useContext } from 'react'
import type { ChangeEvent } from 'react'

type PropTypes = {
    className?: string
}

export default function UserList({ className }: PropTypes) {
    const userPaging = useContext(UserPagingContext)
    if (!userPaging) throw new Error('UserPagingContext not found')

    const handleChangeName = async (e: ChangeEvent<HTMLInputElement>) => {
        userPaging.setDetails({ ...userPaging.deatils, partOfName: e.target.value })
    }

    return (
        <div className={`${styles.UserList} ${className}`}>
            <div className={styles.filters}>
                <input onChange={handleChangeName}></input>
            </div>
            <div className={styles.list}>
                <span className={styles.head}>
                    <h3>Navn</h3>
                    <h3>Brukernavn</h3>
                    <h3>Studie</h3>
                    <h3>Klasse</h3>
                </span>

                <EndlessScroll pagingContext={UserPagingContext} renderer={user => (
                    <UserRow key={user.id} user={user} />
                )} />
            </div>

        </div>
    )
}
