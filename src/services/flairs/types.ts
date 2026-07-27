import type { Flair, Image } from '@/prisma-generated-pn-types'

export type FlairWithImage = Pick<Flair, 'id'> & {
    image: Image
}
