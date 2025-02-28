import { Admission } from '@prisma/client'

export namespace AdmissionConfig {
    export const displayNames = {
        PLIKTTIAENESTE: 'Plikttiaeneste',
        PROEVELSEN: 'Proevelsen',
    } as const satisfies Record<Admission, string>
    export const array = Object.values(Admission)
}
