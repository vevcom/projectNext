import type { Image as ImageT } from '@prisma/client'


export type flairImageType = ImageT & {flairId: number}
