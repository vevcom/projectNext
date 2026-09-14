import { z } from 'zod'

const baseCourse = z.object({
    name: z.string().max(40, 'Maks 40').min(3, 'min 3').trim(),
    code: z.string().max(12, 'Maks 12').min(3, 'min 3').trim(),
    ectspoints: z.coerce.number().min(1, 'min 1'),
})

export const courseSchemas = {
    create: baseCourse,
    update: baseCourse.partial(),
}
