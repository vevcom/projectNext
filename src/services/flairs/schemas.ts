import { z } from 'zod'
import { File } from 'node:buffer'

export const flairSchema = {
    create: z.object(
        {
            file: z.instanceof(File),
            flairName: z.string()
        }
    ),
    update: z.object(
        {
            file: z.instanceof(File).optional(),
            flairName: z.string(),
        }
    )

}

