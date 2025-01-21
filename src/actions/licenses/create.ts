'use server'
import { Action } from '@/actions/Action'
import { Licenses } from '@/services/licenses'

export const createLicenseAction = Action(Licenses.create)
