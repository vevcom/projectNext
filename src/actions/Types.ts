export type ActionErrorCode = 
    | 'DUPLICATE'
    | 'NOT FOUND'
    | 'BAD PARAMETERS'
    | 'UNAUTHENTICATED'
    | 'UNAUTHORIZED'
    | 'UNKNOWN ERROR'

export type ActionError = {
    path?: (number | string)[],
    message: string,
}

export type ActionReturnError = {
    success: false,
    errorCode: ActionErrorCode,
    error?: ActionError[],
}

export type ActionReturn<ReturnType, DataGuarantee extends boolean = true> = 
ActionReturnError | { 
    success: true,
} & (
    DataGuarantee extends true ? {
        data: ReturnType
    } : {
        data?: ReturnType
    }
)

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