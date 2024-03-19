import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const lockerReservationSchema = zfd.formData({
    lockerId: z.coerce.number().gte(0, "Skap id kan ikke være negativ"),
    userId: z.coerce.number().gte(0, "Bruker id kan ikke være negativ")
})

export type lockerReservationSchemaType = z.infer<typeof lockerReservationSchema>
