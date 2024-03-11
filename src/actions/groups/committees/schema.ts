import { zfd } from "zod-form-data";
import { z } from "zod";

export const createCommitteeSchema = zfd.formData({
    name: z.string().max(30, 'maks lengde er 30').min(2, 'minimum lende er 2'),
})

export type createCommitteeSchemaType = z.infer<typeof createCommitteeSchema>