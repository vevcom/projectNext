import { Dot, DotWrapper } from "@prisma/client"

export type DotDetails = {
    userId: number | null,
    onlyActive: boolean,
}

export type DotCursor = {
    id: number
}

export type DotWrapperWithDots = DotWrapper & {
    dots: Dot[]
}