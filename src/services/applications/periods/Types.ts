import type { Image } from '@prisma/client'

export type CountdownInfo = {
    endTime: Date,
    commiteesParticipating: {
        shortname: string,
        logo: Image
    }[]
}
