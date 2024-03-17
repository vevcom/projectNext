import styles from './LockerTable.module.scss'

interface LockerTableProps {
    lockers: {
        id: number
        building: string
        floor: number
        createdAt: Date
        updatedAt: Date
        LockerResorvation: {
            user: {
                firstname: string;
                lastname: string;
            };
        }[]
    }[]
}

export default function LockerTable(props: LockerTableProps) {

    for (const locker of props.lockers) {
        if (locker.LockerResorvation.length) {
            console.log(locker.LockerResorvation[0].user.firstname)
        }
    }

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
                        <td>{locker.LockerResorvation.length ? locker.LockerResorvation[0].user.firstname + " " +  locker.LockerResorvation[0].user.lastname: ""}</td>
                        <td>2</td>
                    </tr>
                ))} 
            </tbody>
            
        </table>
    )
}