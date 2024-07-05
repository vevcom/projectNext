import Link from "next/link"
import type { ExpandedGroup } from "@/server/groups/Types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import styles from "./GroupSelector.module.scss"

type PropTypes = {
    group: ExpandedGroup
}

export default function GroupSelector({ group }: PropTypes) {
    return (
        <Link className={styles.GroupSelector} href={`/admin/groups/${group.id}`}>
            <FontAwesomeIcon icon={faArrowRight} />
        </Link>
    )
}
