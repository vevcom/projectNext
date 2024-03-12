import { readCommitee } from "@/actions/groups/committees/read"
import { notFound } from "next/navigation"


type PropTypes = {
    params: {
        name: string
    }
}

export default async function Committee({ params } : PropTypes) {
    const name = decodeURIComponent(params.name)
    const res = await readCommitee(name)
    if (!res.success) notFound()
    
    return(params.name)
}