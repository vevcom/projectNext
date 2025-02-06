'use server'
import { admissionMethods } from '@/services/admission/methods'
import { action } from '@/actions/action'

export const createAdmissionTrialAction = action(admissionMethods.createTrial)
