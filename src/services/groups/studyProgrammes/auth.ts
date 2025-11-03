import { RequirePermission } from '@/auth/auther/RequirePermission'


export const studyProgrammeAuth = {
    create: RequirePermission.staticFields({ permission: 'STUDY_PROGRAMME_CREATE' }),
    read: RequirePermission.staticFields({ permission: 'STUDY_PROGRAMME_READ' }),
    update: RequirePermission.staticFields({ permission: 'STUDY_PROGRAMME_UPDATE' }),
    destroy: RequirePermission.staticFields({ permission: 'STUDY_PROGRAMME_DESTROY' }),
} as const
