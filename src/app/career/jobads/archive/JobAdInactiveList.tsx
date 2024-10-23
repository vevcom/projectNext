'use client'
import EndlessScroll from "@/components/PagingWrappers/EndlessScroll";
import { JobAdInactivePagingContext } from "@/contexts/paging/JobAdInactivePaging";
import JobAd from "../JobAd";
import styles from "./JobAdInactiveList.module.scss";

export default function JobAdInactiveList() {
    return (
        <main className={styles.JobAdInactiveList}>
            <EndlessScroll 
                loadingInfoClassName={styles.loadingInfo}
                pagingContext={JobAdInactivePagingContext} 
                renderer={jobAd => (
                    <JobAd jobAd={jobAd} />
                )} />
        </main>
    )
}
