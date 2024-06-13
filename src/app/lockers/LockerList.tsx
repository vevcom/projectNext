"use client"
import styles from "./LockerList.module.scss"
import { LockerPagingContext } from "@/context/paging/LockerPaging"
import { useContext } from "react"
import EndlessScroll from "@/components/PagingWrappers/EndlessScroll"
import LockerRow from "./LockerRow"

export default function LockerList() {
    const context = useContext(LockerPagingContext)
    if (!context) throw new Error("No context")
    return (
        <div className={styles.lockerList}>
            <div className={styles.lockerListHeader}>
                <h3>Skap nr.</h3>
                <h3>Bygg</h3>
                <h3>Etasje</h3>
                <h3 className={styles.hideSecond}>Person</h3>
                <h3 className={styles.hideFirst}>Komité</h3>
                <h3>Dato</h3>
            </div>
            <div>
                <EndlessScroll
                    pagingContext={LockerPagingContext}
                    renderer={(locker) => <LockerRow locker={locker} key={locker.id} />}
                />
            </div>
        </div>
    )
}
