import { School } from "@prisma/client"
import { SchoolFieldsToExpose } from "./ConfigVars"

export type SchoolFiltered = Pick<School, typeof SchoolFieldsToExpose[number]>