import 'server-only'
import { fetchExtendedUserInfoFromFeide } from './api'
import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/index'
import { feideScope } from './ConfigVars'

/**
 * The basic attributes contained in the id token returned by feide.
 * The attributes on the id token are documented [here](https://docs.feide.no/reference/tokens.html#ref-id-token).
 * Only the attributes we use should be listen in the type.
 */
interface FeideProfile extends Record<string, unknown> {
    iss: 'https://auth.dataporten.no',
    jti: string,
    aud: string,
    sub: string,
    iat: number,
    exp: number,
    auth_time: number,
    email?: string,
    name?: string,
}

export default function FeideProvider<P extends FeideProfile>(
    options: OAuthUserConfig<P>
): OAuthConfig<P> {
    return {
        id: 'feide',
        name: 'Feide',
        type: 'oauth',
        wellKnown: 'https://auth.dataporten.no/.well-known/openid-configuration',
        authorization: {
            params: {
                scope: feideScope,
            },
        },
        checks: ['pkce', 'state'],
        async profile(profile, tokens) {
            if (!tokens.access_token) {
                // This should never happen.
                throw new Error('No access token.')
            }

            // The id token doesn't have the firstnames or lastnames of the user,
            // so we have to fetch it from the extended user info Feide API endpoint.
            const extendedUserInfo = await fetchExtendedUserInfoFromFeide(tokens.access_token)

            return {
                id: profile.sub,
                username: profile.email?.split('@')[0],
                email: profile.email,
                name: profile.name,
                firstname: extendedUserInfo.givenName?.join(' '),
                lastname: extendedUserInfo.sn?.join(' '),
            }
        },
        options,
    }
}
