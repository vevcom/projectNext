'use client'
import useAuther from './useAuther'
import { EditModeContext } from '@/contexts/EditMode'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { useContext, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import type { AutherDynamicFieldsBound } from '@/auth/auther/Auther'
import type { AuthResultType } from '@/auth/auther/AuthResult'

/**
 * This hook does the following:
 * - If the user is authorized, see the useAuther hook, it will register the component in the edit mode context
 *   signaling that there is a editable component on the page. This causes the context to display the edit mode pencil.
 * - If the user is not authorized, it will not register the component in the edit mode context.
 * @param auther The auther to use to determine if the user is authorized to edit the component - using the useAuther hook.
 * @param authResult Alternatively to auther, you can provide an authResult directly. This is useful
 * when authed status must be determined on server side as an auther cannot be dynamically chosen in a server compinent
 * and then passed to a client component that uses this hook.
 * @returns If the component should open editMode, i.e. if the user is authorized and edit mode is enabled.
 */
export default function useEditMode({
    auther,
    authResult: givenAuthResult,
}: {
    auther: AutherDynamicFieldsBound
    authResult?: undefined
} | {
    auther?: undefined
    authResult: AuthResultType
}): boolean {
    const editModeCtx = useContext(EditModeContext)
    const uniqueKey = useRef(uuid()).current
    const autherAuthResult = useAuther({ auther: auther ? auther : RequireNothing.staticFields({}).dynamicFields({}) })
    const authResult = givenAuthResult ? givenAuthResult : autherAuthResult
    const { addEditableContent, removeEditableContent } = editModeCtx || {
        addEditableContent: () => { },
        removeEditableContent: () => { },
    }
    useEffect(() => {
        if (authResult.authorized) addEditableContent(uniqueKey)
        if (!authResult.authorized) removeEditableContent(uniqueKey)
    }, [auther, authResult, uniqueKey, addEditableContent, removeEditableContent])
    useEffect(() => () => {
        removeEditableContent(uniqueKey)
    }, [uniqueKey, removeEditableContent])
    return authResult.authorized && editModeCtx?.editMode === true
}
