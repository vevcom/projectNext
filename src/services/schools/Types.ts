import type { SchoolFieldsToExpose } from './ConfigVars'
import type { School } from '@prisma/client'

export type SchoolFiltered = Pick<School, typeof SchoolFieldsToExpose[number]>
