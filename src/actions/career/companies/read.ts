'use server'
import { ActionNoData } from "@/actions/Action"
import { Companies } from "@/services/career/companies"

export const readCompanyPageAction = ActionNoData(Companies.readPage)