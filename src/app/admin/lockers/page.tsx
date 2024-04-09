import styles from "./page.module.scss"
import { readLockerLocations } from "@/server/lockers/location/read"
import CreateLockerForm from "./CreateLockerForm"


export default async function Lockers() {
    const locations = await readLockerLocations()
    console.log(locations)

    return (
        <div className={styles.wrapper}>
            <CreateLockerForm locations={locations}/>
        </div>
    )
}