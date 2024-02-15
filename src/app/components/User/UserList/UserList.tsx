'use client'

import styles from './UserList.module.scss'
import { UserPagingContext } from '@/context/paging/UserPaging'
import { useMemo, useContext, useEffect, useState } from 'react'
import { ChangeEvent } from 'react'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'

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
            <EndlessScroll pagingContext={UserPagingContext} renderer={(user, i) => (
                <span key={user.id} className={styles.user}>
                    <div>{i}</div>
                    <div>{user.username}</div>
                    <div>{user.firstname}</div>
                    <div>{user.lastname}</div>
                </span>
            )} />
        </div>
    )
}
