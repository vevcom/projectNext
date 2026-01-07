'use client'
import useAuthorizer from './useAuthorizer'
import { EditModeContext } from '@/contexts/EditMode'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { useContext, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import type { AuthorizerDynamicFieldsBound } from '@/auth/authorizer/Authorizer'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'

/**
 * This hook does the following:
 * - If the user is authorized, see the useAuthorizer hook, it will register the component in the edit mode context
 *   signaling that there is a editable component on the page. This causes the context to display the edit mode pencil.
 * - If the user is not authorized, it will not register the component in the edit mode context.
 * @param authorizer The authorizer to use to determine if the user is authorized to edit the component - using the useAuthorizer hook.
 * @param authResult Alternatively to authorizer, you can provide an authResult directly. This is useful
 * when authed status must be determined on server side as an authorizer cannot be dynamically chosen in a server component
 * and then passed to a client component that uses this hook.
 * @returns If the component should open editMode, i.e. if the user is authorized and edit mode is enabled.
 */
export default function useEditMode({
    authorizer,
    authResult: givenAuthResult,
}: {
    authorizer: AuthorizerDynamicFieldsBound
    authResult?: undefined
} | {
    authorizer?: undefined
    authResult: AuthResultTypeAny
}): boolean {
    const editModeCtx = useContext(EditModeContext)
    const uniqueKey = useRef(uuid()).current
    const authorizerAuthResult = useAuthorizer({ authorizer: authorizer ? authorizer : RequireNothing.staticFields({}).dynamicFields({}) })
    const authResult = givenAuthResult ? givenAuthResult : authorizerAuthResult
    const { addEditableContent, removeEditableContent } = editModeCtx || {
        addEditableContent: () => { },
        removeEditableContent: () => { },
    }
    useEffect(() => {
        if (authResult.authorized) addEditableContent(uniqueKey)
        if (!authResult.authorized) removeEditableContent(uniqueKey)
    }, [authorizer, authResult, uniqueKey, addEditableContent, removeEditableContent])
    useEffect(() => () => {
        removeEditableContent(uniqueKey)
    }, [uniqueKey, removeEditableContent])
    return authResult.authorized && editModeCtx?.editMode === true
}
