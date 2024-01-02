export type ActionReturn<ReturnType> = {
    success: boolean,
    data?: ReturnType,
    error?: ActionError[],
}

export type ActionError = {
    path?: (number | string)[],
    message: string,
}

export type Page<PageSize extends number> = {
    pageSize: PageSize,
    page: number,
}

export type ReadPageInput<PageSize extends number, InputDetailType = undefined> = {
    page: Page<PageSize>,
    details: InputDetailType,
}

export type Action<ReturnType> = (formData: FormData) => Promise<ActionReturn<ReturnType>>
