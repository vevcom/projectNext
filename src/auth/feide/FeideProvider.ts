import 'server-only'
import type { Awaitable } from 'next-auth'
import type { Provider } from 'next-auth/providers/index'
import type { FeideGroup, ExtendedFeideUser, AdapterUserCustom } from './Types'

export type PropType = {
    clientId: string,
    clientSecret: string,
}

export default function FeideProvider({ clientId, clientSecret }: PropType): Provider {
    return {
        id: 'feide',
        name: 'Feide',
        type: 'oauth',
        wellKnown: 'https://auth.dataporten.no/.well-known/openid-configuration',
        authorization: { params: {
            grant_type: 'authorization_code',
            scope: 'email groups-edu groups-org openid userid userinfo-mobile userinfo-name longterm'
        } },
        idToken: true,
        checks: ['pkce', 'state'],
        userinfo: {
            url: 'https://auth.dataporten.no/openid/userinfo',
            async request(context): Promise<ExtendedFeideUser> {
                const { tokens } = context

                const userinfoBasicRequest = fetch('https://auth.dataporten.no/openid/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                    }
                })

                const userinfoExtendedRequest = fetch('https://api.dataporten.no/userinfo/v1/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                    }
                })

                // This should maybe not run at every sign in
                const userinfoGroupsRequest = fetch('https://groups-api.dataporten.no/groups/me/groups', {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                    }
                })

                if (!tokens.id_token) {
                    throw new Error('No id_token provided')
                }

                const clientIdData = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString())

                if (clientIdData.aud !== process.env.FEIDE_CLIENT_ID) {
                    throw new Error('The audience for the response from Feide is incorrect')
                }

                const [userinfoBasic,
                    userinfoExtended,
                    userinfoGroups
                ] = await Promise.all([userinfoBasicRequest, userinfoExtendedRequest, userinfoGroupsRequest])

                if (!userinfoBasic.ok || !userinfoExtended.ok || !userinfoGroups.ok) {
                    throw new Error('Failed to fetch user information')
                }

                const profile = await userinfoBasic.json()

                const profileExtended = await userinfoExtended.json()

                const groups: Array<FeideGroup> = await userinfoGroups.json()

                return { ...profile, extended: profileExtended, groups, tokens }
            }
        },
        profile(profile: ExtendedFeideUser): Awaitable<AdapterUserCustom> {
            return {
                id: profile.sub,
                email: profile.email,
                firstname: profile.extended.givenName.join(' '),
                lastname: profile.extended.sn.join(' '),
                username: profile.email.split('@')[0],
            }
        },
        clientId,
        clientSecret,
    }
}
