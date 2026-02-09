import { RequirePermission } from '@/auth/authorizer/RequirePermission'


export const studyProgrammeAuth = {
    create: RequirePermission.staticFields({ permission: 'STUDY_PROGRAMME_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'STUDY_PROGRAMME_READ' }),
    update: RequirePermission.staticFields({ permission: 'STUDY_PROGRAMME_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'STUDY_PROGRAMME_ADMIN' }),
} as const
