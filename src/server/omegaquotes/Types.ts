import type { omegaQuoteFieldsToExpose } from './CofigVars'
import type { OmegaQuote } from '@prisma/client'

export type OmegaquoteFiltered = Pick<OmegaQuote, typeof omegaQuoteFieldsToExpose[number]>

export type OmegaquoteCursor = {
    id: number
}