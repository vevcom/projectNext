'use server'
import type { ReturnType } from "./ReturnType"
import { ActionReturn } from "@/actions/type"

export default function updateArticleVisibility(
    id: number, 
    visibility: unknown
): Promise<ActionReturn<ReturnType>> {
    throw new Error('Not implemented')
}