'use server'

import { action } from '@/services/action'
import { AdmissionMethods } from '@/services/admission/methods'

export const createAdmissionTrialAction = action(AdmissionMethods.createTrial)
