import type { AuthStatus } from '@/auth/getUser'
import type { ServerErrorCode, ErrorMessage } from '@/server/error'

export type ActionErrorCode = ServerErrorCode | AuthStatus

export type ActionReturnError = {
    success: false,
    errorCode: ActionErrorCode,
    error?: ErrorMessage[],
}

export type ActionReturn<ReturnType, DataGuarantee extends boolean = true> = (
    ActionReturnError
) | {
    success: true,
} & (
    DataGuarantee extends true ? {
        data: ReturnType
    } : {
        data?: ReturnType
    }
)

export type Page<PageSize extends number, Cursor> = {
    readonly pageSize: PageSize,
    page: number,
    cursor: Cursor
}

export type ReadPageInput<PageSize extends number, Cursor, InputDetailType = undefined> = {
    page: Page<PageSize, Cursor>,
    details: InputDetailType,
}

export type Action<ReturnType, DataGuarantee extends boolean = true> = (formData: FormData) => (
    Promise<ActionReturn<ReturnType, DataGuarantee>>
)
