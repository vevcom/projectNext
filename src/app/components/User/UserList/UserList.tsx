'use client'

import styles from './UserList.module.scss'
import { UserPagingContext } from '@/context/paging/UserPaging'
import { useMemo, useContext, useEffect, useState } from 'react'
import { ChangeEvent } from 'react'
import EndlessScroll from '../../PagingWrappers/EndlessScroll'

function arraysEqual(a : object[], b: object[]) {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    for (let i = 0; i < sortedA.length; i++) {
        if (sortedA[i] !== sortedB[i]) return false;
    }
    return true;
}

export default function UserList({  }) {
    const userPaging = useContext(UserPagingContext)
    if (!userPaging) throw new Error('UserPagingContext not found')
    const [displayData, setDisplayData] = useState(userPaging.state.data);

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        userPaging.setDetails({partOfName: e.target.value, groups: []})
    }

    const endlessScroll = useMemo(() => {
        console.log(displayData)
        return (
        <EndlessScroll pagingContext={UserPagingContext} renderer={(user, i) => (
            <span key={user.id} className={styles.user}>
                <div>{i}</div>
                <div>{user.username}</div>
                <div>{user.firstname}</div>
                <div>{user.lastname}</div>
            </span>
        )} />
    )}, [userPaging.state.data])

    return (
        <div className={styles.UserList}>
            <button onClick={userPaging.loadMore}>heit mer</button>
            <input onChange={handleChange}></input>
            {endlessScroll}
        </div>
    )
}
