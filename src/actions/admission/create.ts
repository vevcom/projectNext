'use server'
import { createAdmissionTrial } from '@/services/admission/create'
import { action } from '@/actions/action'

export const createAdmissionTrialAction = action(createAdmissionTrial)
