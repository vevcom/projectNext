'use server'
import { Licenses } from "@/services/licenses"
import { ActionNoData } from "../Action"

export const destroyLicenseAction = ActionNoData(Licenses.destroy)