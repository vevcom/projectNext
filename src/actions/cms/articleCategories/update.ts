'use server'
import type { ReturnType } from "./ReturnType"
import { ActionReturn } from "@/actions/type"

export default async function updateArticleCategoryVisibility(
    id: number, 
    visibility: unknown
): Promise<ActionReturn<ReturnType>> {
    throw new Error('Not implemented')
}