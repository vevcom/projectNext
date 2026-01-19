import { Admission } from '@/prisma-generated-pn-types'

export const admissionDisplayNames = {
    PLIKTTIAENESTE: 'Plikttiaeneste',
    PROEVELSEN: 'Proevelsen',
} as const satisfies Record<Admission, string>

export const allAdmissions = Object.values(Admission)
