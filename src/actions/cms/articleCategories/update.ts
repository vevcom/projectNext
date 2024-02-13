'use server'
import type { ReturnType } from "./ReturnType"
import { ActionReturn } from "@/actions/type"
import schema from "./schema"

export default async function updateArticleCategoryVisibility(
    id: number, 
    visibility: unknown
): Promise<ActionReturn<ReturnType>> {
    throw new Error('Not implemented')
}

export default async function updateArticleCategory(

)