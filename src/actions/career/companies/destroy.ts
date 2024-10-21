'use server'
import { ActionNoData } from "@/actions/Action"
import { Companies } from "@/services/career/companies"

export const destroyCompanyAction = ActionNoData(Companies.destory)