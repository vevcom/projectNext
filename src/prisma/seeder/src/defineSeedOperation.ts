import { withServiceContext } from '@/services/serviceOperation'
import type { PrismaClient } from '@/prisma-generated-pn-client'

export function defineSeedOperation<ReturnType>(operation: (prisma: PrismaClient) => Promise<ReturnType>) {
    return () => withServiceContext({}, true, async ({ prisma }) => operation(prisma))
}
