import type { dotSchemas } from './schemas'
import type { InferPagingCursor, InferPagingDetails } from '@/lib/paging/schema'
import type { Dot, DotWrapper, User } from '@/prisma-generated-pn-types'

export type DotDetails = InferPagingDetails<typeof dotSchemas.readPage>

export type DotCursor = InferPagingCursor<typeof dotSchemas.readPage>

export type DotWithActive = Dot & {
    active: boolean
}

export type DotWrapperWithDots = DotWrapper & {
    dots: DotWithActive[],
    user: Pick<User, 'firstname' | 'lastname' | 'username'>,
    accuser: Pick<User, 'firstname' | 'lastname' | 'username'>,
}
