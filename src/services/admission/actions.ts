'use server'

import { action } from '@/actions/action'
import { AdmissionMethods } from '@/services/admission/methods'

export const createAdmissionTrialAction = action(AdmissionMethods.createTrial)
