'use server'
import CabinRoomForm from './CabinRoomForm'
import styles from './page.module.scss'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { AddHeaderItemPopUp } from '@/app/_components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { readRoomsAction } from '@/actions/cabin'
import { v4 as uuid } from 'uuid'


export default async function CabinRoom() {
    const rooms = unwrapActionReturn(await readRoomsAction(null))

    return <PageWrapper
        title="Heutte Rom"
        headerItem={<AddHeaderItemPopUp PopUpKey="addCabinRoom">
            <CabinRoomForm />
        </AddHeaderItemPopUp>}
    >
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Rom</th>
                    <th>Sengeplasser</th>
                </tr>
            </thead>
            <tbody>
                {rooms.map(room => <tr key={uuid()}>
                    <td>{room.name}</td>
                    <td>{room.capacity}</td>
                </tr>)}
            </tbody>
        </table>
    </PageWrapper>
}
