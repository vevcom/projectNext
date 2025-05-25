'use server'
import { AdmissionMethods } from '@/services/admission/methods'
import { action } from '@/actions/action'

export const createAdmissionTrialAction = action(AdmissionMethods.createTrial)
