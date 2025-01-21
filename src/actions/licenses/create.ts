'use server'
import { Licenses } from "@/services/licenses"
import { Action } from "../Action"

export const createLicenseAction = Action(Licenses.create)