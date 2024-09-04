'use client'
import Image from "@/app/_components/Image/Image"
import useInterval from "@/hooks/useInterval"
import { Image as ImageT } from "@prisma/client"
import { useState } from "react"

type PropTypes = {
    committees: {
        shortname: string,
        logo: ImageT
    }[]
}

export default function CommitteeLogoRoll({ committees } : PropTypes) {
    const [currentCommitteeIndex, setCurrentCommitteeIndex] = useState(committees.length ? 0 : null)

    useInterval(() => {
        if (!committees.length) return
        if (currentCommitteeIndex === null) return setCurrentCommitteeIndex(0)
        if (committees.length) {
            setCurrentCommitteeIndex((currentCommitteeIndex + 1) % committees.length)
        }
    }, 5000)

    return currentCommitteeIndex !== null ? (
        <div className="">
            <Image width={600} image={committees[currentCommitteeIndex].logo} />
            <span>{committees[currentCommitteeIndex].shortname}</span>
        </div>
    ) : <></>
}
