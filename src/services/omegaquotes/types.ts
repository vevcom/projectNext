import type { omegaQuoteFieldsToExpose } from './constants'
import type { OmegaQuote } from '@/prisma-generated-pn-types'

export type OmegaquoteFiltered = Pick<OmegaQuote, typeof omegaQuoteFieldsToExpose[number]>

export type OmegaquoteCursor = {
    id: number
}
