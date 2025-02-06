import { Admission } from '@prisma/client'

export const admissionConfig = {
    displayNames: {
        PLIKTTIAENESTE: 'Plikttiaeneste',
        PROEVELSEN: 'Proevelsen',
    } satisfies Record<Admission, string>,
    array: Object.values(Admission),
} as const
