import type { AuthStatus } from '@/auth/getUser'
import type { ServerErrorCode, ErrorMessage } from '@/services/error'

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

export type Action<ReturnType, DataGuarantee extends boolean = true> = (formData: FormData) => (
    Promise<ActionReturn<ReturnType, DataGuarantee>>
)
