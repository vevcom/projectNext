import 'server-only'
import { apiHandler } from '@/api/apiHandler'

const handler = apiHandler({})
export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
