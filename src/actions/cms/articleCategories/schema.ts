import { z } from "zod"

const schema = z.object({
    name: z.string().min(2, 'Minmum lengde på 2').max(18, 'Maks lengde på navn er 18').trim(),
    description: z.string().min(5, 'Minimum lengde på en beskrivelse er 5')
        .max(70, 'max 70 karakrerer').or(z.literal('')),
})

export default schema