import { createSelection } from '@/server/createSelection'

export const omegaQuoteFieldsToExpose = ['id', 'author', 'quote', 'timestamp'] as const
export const omegaQuoteFilterSelection = createSelection([...omegaQuoteFieldsToExpose])
