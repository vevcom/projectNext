import type { Screen } from '@prisma/client'
import { ExpandedScreenPage } from './pages/Types'

export type ExpandedScreen = Screen & {
    pages: ExpandedScreenPage[]
}