import PageWrapper from "@/components/PageWrapper/PageWrapper";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./page.module.scss";
import Link from "next/link";

export default async function JobAdsArchive() {
    return (
        <PageWrapper title="Arkiverte jobbannonser" headerItem={
            <Link href="/career/jobads" className={styles.backLink}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
        }>
            <></>
        </PageWrapper>
    )
}