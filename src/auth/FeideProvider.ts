import type { Provider } from "next-auth/providers/index"

export type PropType = {
    clientId: string,
    clientSecret: string,
}

export default function FeideProvider({clientId, clientSecret} : PropType) : Provider {
    return {
        id: "feide",
        name: "Feide",
        type: "oauth",
        wellKnown: "https://auth.dataporten.no/.well-known/openid-configuration",
        authorization: { params: {
            grant_type: "authorization_code",
            scope: "openid userid profile email"
        } },
        idToken: true,
        checks: ["pkce", "state"],
        profile(profile, token) {
            console.log(token);
            return {
                id: 1234,
                username: profile.sub,
                password: profile.name,
                firstname: profile.email,
                lastname: profile.picture,
            }
        },
        clientId,
        clientSecret,
    }
}
