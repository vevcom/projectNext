import type { School as SchoolType } from "@prisma/client"
import ImageCard from "../ImageCard/ImageCard"

type PropTypes = {
    school: SchoolType
}

export default function School({ school }: PropTypes) {
    return (
        <ImageCard image={null} title={school.shortname} href={`/schools/${school.name}`}>
            {school.desctiption}
        </ImageCard>
    )
}
