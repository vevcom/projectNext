import styles from './LockerTable.module.scss'

interface LockerTableProps {
    lockers: {
        id: number;
        building: string;
        floor: number;
        createdAt: Date;
        updatedAt: Date;
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
                        <td>2</td>
                    </tr>
                ))} 
            </tbody>
            
        </table>
    )
}