import { Admission } from '@prisma/client'

export const AdmissionDisplayNames = {
    PLIKTTIAENESTE: 'Plikttiaeneste',
    PROEVELSEN: 'Proevelsen',
} satisfies Record<Admission, string>

export const AdmissionsArray = Object.values(Admission)
