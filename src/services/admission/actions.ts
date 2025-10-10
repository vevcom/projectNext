'use server'

import { action } from '@/services/action'
import { admissionMethods } from '@/services/admission/methods'

export const createAdmissionTrialAction = action(admissionMethods.createTrial)
