import type { OmegaQuote } from '@prisma/client'

export type OmegaquoteFiltered = Pick<OmegaQuote, 'id' | 'author' | 'quote' | 'timestamp'>
