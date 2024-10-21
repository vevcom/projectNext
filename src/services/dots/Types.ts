import type { Dot, DotWrapper, User } from '@prisma/client'

export type DotDetails = {
    userId: number | null,
    onlyActive: boolean,
}

export type DotCursor = {
    id: number
}

export type DotWithActive = Dot & {
    active: boolean
}

export type DotWrapperWithDots = DotWrapper & {
    dots: DotWithActive[],
    user: Pick<User, 'firstname' | 'lastname' | 'username'>,
    accuser: Pick<User, 'firstname' | 'lastname' | 'username'>,
}
