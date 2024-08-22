import type { ExpandedScreenPage } from './pages/Types'
import type { Screen } from '@prisma/client'

export type ExpandedScreen = Screen & {
    pages: ExpandedScreenPage[]
}
