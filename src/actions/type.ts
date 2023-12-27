

export type ActionReturn<ReturnType> = {
    success: boolean,
    data?: ReturnType,
    error?: string,
}

export type Action<ReturnType> = (formData: FormData) => Promise<ActionReturn<ReturnType>>