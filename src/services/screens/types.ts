import type { ExpandedScreenPage } from './pages/types'
import type { Screen } from '@/prisma-generated-pn-types'

export type ExpandedScreen = Screen & {
    pages: ExpandedScreenPage[]
}

export type ScreenPageMoveDirection = 'UP' | 'DOWN'
