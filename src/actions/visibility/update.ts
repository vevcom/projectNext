'use server'
import { ActionReturn } from "../Types";
 
export async function updateVisibilityAction(formdata: FormData) : Promise<ActionReturn<void>> {
    return {success: true, data: undefined}
}   