import { Permission } from "@prisma/client"

type PermissionCategory = {
    title: string,
    permissions: {
        name: string,
        permission: Permission,
    }[],
}

// defines the layout of the role edit section
export let permissionCategories: PermissionCategory[] = [
    {
        title: '«Bulshit» og «omegaquotes»',
        permissions: [
            { permission: 'OMEGAQUOTES_READ', name: 'Lese omegaquotes' },
            { permission: 'OMEGAQUOTES_WRITE', name: 'Skrive omegaquotes' },
        ],
    },
    {
        title: 'Ombul',
        permissions: [
            { permission: 'OMBUL_READ', name: 'Lese ombul' },
            { permission: 'OMBUL_CREATE', name: 'Lage ombul' },
            { permission: 'OMBUL_UPDATE', name: 'Oppdatere ombul' },
            { permission: 'OMBUL_DESTROY', name: 'Slette ombul' },
        ],
    },
]

// Find permissions that are not in permissionCategories
const manualPermissions: Permission[] = permissionCategories
    .map(({ permissions }) => permissions)
    .flat()
    .map(({ permission }) => permission)
const allPermissions: Permission[] = Object.values(Permission)
const missionPermissions: Permission[] = allPermissions.filter(permission => !manualPermissions.includes(permission))

// Add missing permissions to permission categories
permissionCategories.push({
    title: 'Øvrige tillganger',
    permissions: missionPermissions.map(permission => ({
        permission,
        name: permission,
    }))
})
