import styles from "./page.module.scss"
import { readLockerLocations } from "@/server/lockers/location/read"
import CreateLockerForm from "./CreateLockerForm"


export default async function Locker() {
    const locations = await readLockerLocations()

    return (
        <div className={styles.wrapper}>
            <CreateLockerForm locations={locations}/>
        </div>
    )
}
