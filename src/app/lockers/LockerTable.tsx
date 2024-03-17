import styles from './LockerTable.module.scss'

interface LockerTableProps {
    lockers: {
        id: number
        building: string
        floor: number
        createdAt: Date
        updatedAt: Date
        LockerReservation: {
            user: {
                firstname: string;
                lastname: string;
            };
        }[]
    }[]
}

export default function LockerTable(props: LockerTableProps) {
    return (
        <table className={styles.lockerTable}>
            <thead>
                <tr>
                    <th>Skap nr.</th>
                    <th>Bygg</th>
                    <th>Etasje</th>
                    <th>Kommentar</th>
                    <th>Person</th>
                    <th>Komité</th>
                </tr>
            </thead>
            <tbody>
                {props.lockers.map(locker => (
                    <tr key={locker.id}>
                        <td>{locker.id}</td>
                        <td>{locker.building}</td>
                        <td>{locker.floor}</td>
                        <td>K</td>
                        <td>{locker.LockerReservation.length ? locker.LockerReservation[0].user.firstname + " " +  locker.LockerReservation[0].user.lastname: ""}</td>
                        <td></td>
                    </tr>
                ))} 
            </tbody>
            
        </table>
    )
}