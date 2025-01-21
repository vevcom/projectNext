'use server'

import { Licenses } from "@/services/licenses"
import { Action } from "@/actions/Action"

export const updateLicenseAction = Action(Licenses.update)