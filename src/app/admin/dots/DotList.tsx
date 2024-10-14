'use client'
import EndlessScroll from '@/app/_components/PagingWrappers/EndlessScroll'
import { DotPagingContext } from '@/contexts/paging/DotPaging'
import styles from './DotList.module.scss'
import { displayDate } from '@/dates/displayDate'
import { useContext } from 'react'
import { UserSelectionContext } from '@/contexts/UserSelection'
import Link from 'next/link'
import { QueryParams } from '@/lib/query-params/queryParams'
import PopUp from '@/app/_components/PopUp/PopUp'
import UserList from '@/app/_components/User/UserList/UserList'
import { useRouter } from 'next/navigation'
import { PopUpContext } from '@/contexts/PopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

type PropTypes = {
    onlyActive: boolean
}

export default function DotList({ onlyActive }: PropTypes) {
    const userSelection = useContext(UserSelectionContext)
    const popUpContext = useContext(PopUpContext)
    const { push } = useRouter()
    if (!userSelection) return <></>
    userSelection.onSelection(
        user => {
            popUpContext?.remove('selectUser')
            push(`/admin/dots/?${QueryParams.onlyActive.encodeUrl(onlyActive)}`+
            `&${user ? QueryParams.userId.encodeUrl(user.id) : ''}`)
        }
    )

    return (
        <>
        <span className={styles.selection}>
            {
                userSelection.user ? 
                <div className={styles.userSelected}>
                    <p>{userSelection.user.firstname} {userSelection.user.lastname}</p>
                    <button onClick={() => userSelection.setUser(null)}>
                        <FontAwesomeIcon icon={faX} />
                    </button>
                </div> :
                <div className={styles.userSelected}>
                    <p>Viser prikker for alle brukere</p>
                </div>
            }
            <PopUp PopUpKey="selectUser" showButtonClass={styles.openUserList} showButtonContent={
                <>Velg Bruker</>
            }>
                <UserList />
            </PopUp>
            <Link className={styles.selectActive} href={
                `/admin/dots/`+
                `?${QueryParams.onlyActive.encodeUrl(!onlyActive)}`+
                `&${userSelection.user ? QueryParams.userId.encodeUrl(userSelection.user?.id) : ''}`
                }>
                {onlyActive ? 'Vis alle prikker' : 'Vis aktive prikker'}
            </Link>
        </span>
        <table className={styles.DotList}>
            <thead>
                <tr>
                    <th>Grunn</th>
                    <th>For</th>
                    <th>Gitt av</th>
                    <th>Utløpstider</th>
                </tr>
            </thead>
            <tbody>
                <EndlessScroll pagingContext={DotPagingContext} renderer={
                    dotWrapper => <tr key={dotWrapper.id}>
                        <td>{dotWrapper.reason}</td>
                        <td>{dotWrapper.user.username}</td>
                        <td>{dotWrapper.accuser.username}</td>
                        <td>
                        {
                            dotWrapper.dots.map(dot => (
                                <div key={dot.id}>
                                    {displayDate(dot.expiresAt)}
                                </div>
                            ))
                        }
                        </td>
                    </tr>
                } />
            </tbody>
        </table>
        </>
    )
}
