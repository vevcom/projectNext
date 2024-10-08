import 'server-only'
import { ServiceMethodHandler } from "@/services/ServiceMethodHandler";
import { updateEventTagValidation } from "./validation";

export const update = ServiceMethodHandler({
    withData: true,
    validation: updateEventTagValidation,
    handler: async (prisma, { id }: {id: number}, {color, ...data}) => {
        const colorR = color ? parseInt(color.slice(1, 3), 16) : undefined
        const colorG = color ? parseInt(color.slice(3, 5), 16) : undefined
        const colorB = color ? parseInt(color.slice(5, 7), 16) : undefined
        return await prisma.eventTag.update({
            where: {
                id
            },
            data: {
                ...data,
                colorR,
                colorG,
                colorB,
            }
        })
    }
})