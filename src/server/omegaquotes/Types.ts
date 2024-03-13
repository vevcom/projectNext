import type { OmegaQuote } from '@prisma/client'
import { omegaQuoteFieldsToExpose } from './CofigVars'

export type OmegaquoteFiltered = Pick<OmegaQuote, typeof omegaQuoteFieldsToExpose[number]>
