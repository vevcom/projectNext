import { Dot, DotWrapper, User } from "@prisma/client"

export type DotDetails = {
    userId: number | null,
    onlyActive: boolean,
}

export type DotCursor = {
    id: number
}

export type DotWrapperWithDots = DotWrapper & {
    dots: Dot[],
    user: Pick<User, 'firstname' | 'lastname' | 'username'>,
    accuser: Pick<User, 'firstname' | 'lastname' | 'username'>,
}