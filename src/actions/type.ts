

export type ActionReturn<ReturnType> = {
    success: boolean,
    data?: ReturnType,
    error?: ActionError[],
}

export type ActionError = {
    path?: (number | string)[],
    message: string,
}

export type Action<ReturnType> = (formData: FormData) => Promise<ActionReturn<ReturnType>>
