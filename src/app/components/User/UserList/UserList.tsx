'use client'

import styles from './UserList.module.scss'
import { UserPagingContext } from '@/context/paging/UserPaging'
import { useContext } from 'react'
import { ChangeEvent } from 'react'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import UserRow from '../UserRow'
export default function UserList() {
    const userPaging = useContext(UserPagingContext)
    if (!userPaging) throw new Error('UserPagingContext not found')

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        userPaging.setDetails({partOfName: e.target.value, groups: []})
    }

    return (
        <div className={styles.UserList}>
            <div className={styles.filters}>
                <input onChange={handleChange}></input>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Navn</th>
                        <th>Brukernavn</th>
                        <th>Linje</th>
                        <th>Klasse</th>
                    </tr>
                </thead>
                <tbody>
                    <EndlessScroll pagingContext={UserPagingContext} renderer={user => (
                        <UserRow key={user.id} user={user} />
                    )} />
                </tbody>
            </table>
            
        </div>
    )
}
