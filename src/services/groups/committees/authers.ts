import { RequirePermission } from '@/auth/auther/RequirePermission'

export namespace CommitteeAuthers {
    export const read = RequirePermission.staticFields({ permission: 'COMMITTEE_READ' })
}
