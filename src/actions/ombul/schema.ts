import { z } from 'zod'
import { maxOmbulFileSize } from './ConfigVars'

const ombulSchema = z.object({
    ombulFile: z.instanceof(File).refine(file => file.size < maxOmbulFileSize, 'File size must be less than 10mb'),
    year: z.number().optional(),
    issueNumber: z.number().optional(),
    name: z.string().min(2, 'Minimum length of name is 2').max(18, 'Maximum length of name is 18').trim(),
})

export default ombulSchema