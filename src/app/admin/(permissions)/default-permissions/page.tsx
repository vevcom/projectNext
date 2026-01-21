import { updateDefaultPermissionsAction, readDefaultPermissionsAction } from '@/services/permissions/actions'
import Form from '@/components/Form/Form'
import DisplayAllPermissions from '@/components/Permission/DisplayAllPermissions'
import React from 'react'

export default async function Defaults() {
    const defaultPermissionsRes = await readDefaultPermissionsAction()

    if (!defaultPermissionsRes.success) {
        throw new Error(`Kunne ikke hente standard tilganger. ${defaultPermissionsRes.errorCode}`)
    }

    const defaultPermissions = defaultPermissionsRes.data

    return (
        <>
            <h1>Standard Tilganger</h1>
            <i>Dette er tilganger alle har på nettsiden uavhengig av innlogging og gruppeafiliasjoner</i>
            <Form submitText="Lagre" action={updateDefaultPermissionsAction}>
                <DisplayAllPermissions renderBesidePermission={
                    permission => (
                        <label>
                            <input
                                type="checkbox"
                                name="permissions"
                                value={permission}
                                defaultChecked={defaultPermissions.includes(permission)}
                            />
                        </label>
                    )
                }
                />
            </Form>
        </>

    )
}
