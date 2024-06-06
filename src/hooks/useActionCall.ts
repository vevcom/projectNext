'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import type { ActionReturn, ActionReturnError } from '@/actions/Types'

/**
 * You sometimes want to call a server action that reads from the client. This hook helps with that.
 * @param action - A server action to call
 * @returns The data returned from the server action. If success is false, the error is returned instead.
 */
export default function useActionCall<
    Data,
    DataGuarantee extends true
>(
    action: () => Promise<ActionReturn<Data, DataGuarantee>>
) {
    const [res, setRes] = useState<{
        data: Data | null,
        error: null
    } | {
        data: null,
        error: ActionReturnError
    }>({
        data: null,
        error: null
    })

    useEffect(() => {
        action().then((result) => {
            if (result.success) {
                setRes({ data: result.data, error: null })
            } else {
                setRes({ data: null, error: result })
            }
        }).catch(() => {
            setRes({ data: null, error: { success: false, errorCode: 'UNKNOWN ERROR' } })
        })
    }, [action])

    return res
}