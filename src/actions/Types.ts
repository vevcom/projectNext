export type ActionError = {
    path?: (number | string)[],
    message: string,
}

export type ActionReturn<ReturnType, DataGuarantee extends boolean = true> = {
    success: false,
    error?: ActionError[],
} | (DataGuarantee extends true ? {
    success: true,
    data: ReturnType,
} : {
    success: true,
    data?: ReturnType,
})

export type Page<PageSize extends number> = {
    readonly pageSize: PageSize,
    page: number,
}

export type ReadPageInput<PageSize extends number, InputDetailType = undefined> = {
    page: Page<PageSize>,
    details: InputDetailType,
}

export type Action<ReturnType, DataGuarantee extends boolean = true> = (formData: FormData) => (
    Promise<ActionReturn<ReturnType, DataGuarantee>>
)
