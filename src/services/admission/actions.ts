'use server'

import { action } from '@/services/action'
import { admissionOperations } from '@/services/admission/operations'

export const createAdmissionTrialAction = action(admissionOperations.createTrial)
