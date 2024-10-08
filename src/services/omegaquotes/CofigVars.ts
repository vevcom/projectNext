import { createSelection } from '@/services/createSelection'
import type { OmegaQuote } from '@prisma/client'

export const omegaQuoteFieldsToExpose = ['id', 'author', 'quote', 'timestamp'] as const satisfies (keyof OmegaQuote)[]
export const omegaQuoteFilterSelection = createSelection([...omegaQuoteFieldsToExpose])
