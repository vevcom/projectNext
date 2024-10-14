import 'server-only'
import { ServiceMethodHandler } from "../ServiceMethodHandler";
import { DOT_BASE_DURATION } from "./ConfigVars";
import { createDotValidation } from "./validation";

export const create = ServiceMethodHandler({
    withData: true,
    validation: createDotValidation,
    handler: (prisma, params: { accuserId: number }, data) => {
        const expiresAt = new Date(Date.now() + DOT_BASE_DURATION);
        return prisma.dot.create({
            data: {
                ...data,
                expiresAt,
                accuserId: params.accuserId
            }
        })
    }
})