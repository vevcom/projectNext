import { readCommitee } from "@/actions/groups/committees/read"
import { readSpecialImage } from "@/actions/images/read"
import BackdropImage from "@/app/components/BackdropImage/BackdropImage"
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
    const committee = res.data

    let committeeLogo = committee.logoImage.image
    if (!committeeLogo) {
        const res = await readSpecialImage('DAFAULT_COMMITTEE_LOGO')
        if (!res.success) throw new Error('Kunne ikke finne standard komitelogo')
        committeeLogo = res.data
    }

    return (
        <BackdropImage image={committeeLogo}>
            <h1>{committee.name}</h1>
        </BackdropImage>
    )
}