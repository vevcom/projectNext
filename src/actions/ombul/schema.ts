import { z } from 'zod'
import { maxOmbulFileSize } from './ConfigVars'

const ombulSchema = z.object({
    ombulFile: z.instanceof(File).refine(file => file.size < maxOmbulFileSize, 'File size must be less than 10mb'),
    year: z.number().optional(),
    issueNumber: z.number().optional()
})

export default ombulSchema