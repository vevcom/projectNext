import { prismaCall } from "@/server/prismaCall";
import { ExpandedClass } from "./Types";

export async function readClasses(): Promise<ExpandedClass[]> {
    return await prismaCall(() => prisma.class.findMany({}))
}

export async function readClass(id: number): Promise<ExpandedClass> {
    return await prismaCall(() => prisma.class.findUniqueOrThrow({
        where: {
            id,
        },
    }))
}