'use server'
import { Action } from "@/actions/Action"
import { Companies } from "@/services/career/companies"

export const createCompanyAction = Action(Companies.create)