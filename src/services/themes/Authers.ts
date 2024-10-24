import { RequirePermission } from '@/auth/auther/RequirePermission'

export const CreateThemeAuther = RequirePermission.staticFields({ permission: 'THEME_ADMIN'})

export const UpdateThemeAuther = RequirePermission.staticFields({ permission: 'THEME_ADMIN' })

export const DestroyThemeAuther = RequirePermission.staticFields({ permission: 'THEME_ADMIN' })
