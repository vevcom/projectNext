import styles from './page.module.scss'
import readLockers from '@/actions/lockers/read'
import readLockerResorvations from '@/actions/lockers/resorvations/read'
import LockerTable from './LockerTable'
import prisma from '@/prisma'

export default async function Skapres() {
    
    const lockers = await readLockers()
    if (!lockers.success) {
        throw new Error("Kunne ikke hente skapdata")
    }

    const lockerResorvations = await readLockerResorvations()
    if (!lockerResorvations.success) {
        throw new Error("Kunne ikke hente skapresorvasjoner")
    }

    for (const locker of lockers.data) {
        console.log(locker.LockerResorvation)
    }

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.header}>Skapreservasjon</h1>
            
            <LockerTable lockers={lockers.data}></LockerTable>
            
            <ul className={styles.lockerList}>
                {lockerResorvations.data.map(resorvation => (
                    <li>
                        <p>{resorvation.lockerId}</p>
                        <p>{resorvation.userId}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}