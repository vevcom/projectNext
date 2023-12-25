

export type ActionReturn = {
    success: boolean,
    data?: object,
    error?: string,
}

export type Action = (formData: FormData) => Promise<ActionReturn>