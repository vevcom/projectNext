import type { User as PrismaUser } from '@prisma/client'
import type { TokenSetParameters } from 'openid-client'

export type FeideGroup = {
    id: string,
    displayName: string,
    type: string,
    membership: {
        basic: string,
        active: boolean,
        displayName: string,
    }
}

export type ExtendedFeideUser = {
    aud: string,
    sub: string,
    name: string,
    email: string,
    email_verified: boolean,
    extended: {
        givenName: string[],
        sn: string[],
    },
    groups: FeideGroup[],
    tokens: TokenSetParameters
}

export const adapterUserCutomFieldsArr = ['id', 'username', 'email', 'firstname', 'lastname'] as const
export const adapterUserCutomFields = adapterUserCutomFieldsArr.reduce((prev, field) => ({
    ...prev,
    [field]: true
}), {} as {[key in typeof adapterUserCutomFieldsArr[number]]: true })

export interface AdapterUserCustom extends Omit<
    Pick<PrismaUser, typeof adapterUserCutomFieldsArr[number]>,
    'id'
> {id: number | string}
