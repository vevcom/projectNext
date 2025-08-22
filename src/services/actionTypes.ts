import type { ErrorMessage, ErrorCode } from '@/services/error'

export type ActionReturnError = {
    success: false,
    errorCode: ErrorCode,
    httpCode: number,
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
