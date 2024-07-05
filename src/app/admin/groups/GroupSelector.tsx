import Link from "next/link"
import type { ExpandedGroup } from "@/server/groups/Types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

type PropTypes = {
    group: ExpandedGroup
}

export default function GroupSelector({ group }: PropTypes) {
    return (
        <Link href={`/admin/groups/${group.id}`}>
            <FontAwesomeIcon icon={faArrowRight} />
        </Link>
    )
}
