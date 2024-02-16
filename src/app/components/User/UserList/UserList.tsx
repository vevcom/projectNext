'use client'

import styles from './UserList.module.scss'
import { UserPagingContext } from '@/context/paging/UserPaging'
import { useContext } from 'react'
import { ChangeEvent } from 'react'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import UserRow from '../UserRow'

export default function UserList({  }) {
    const userPaging = useContext(UserPagingContext)
    if (!userPaging) throw new Error('UserPagingContext not found')

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        userPaging.setDetails({partOfName: e.target.value, groups: []})
    }

    return (
        <div className={styles.UserList}>
            <button onClick={userPaging.loadMore}>heit mer</button>
            <input onChange={handleChange}></input>
            <table>
                <thead>

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
