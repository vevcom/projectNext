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
            scope: "email groups-edu groups-org openid userid userinfo-mobile userinfo-name longterm"
        } },
        idToken: true,
        checks: ["pkce", "state"],
        userinfo: {
            url: "https://auth.dataporten.no/openid/userinfo",
            async request(context) {
                const { tokens } = context;

                const userinfoBasicRequest = fetch("https://auth.dataporten.no/openid/userinfo", {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                    }
                })

                const userinfoExtendedRequest = fetch("https://api.dataporten.no/userinfo/v1/userinfo", {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                    }
                })

                if (!tokens.id_token) {
                    throw new Error("No id_token provided");
                }

                const clientIdData = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString());

                if (clientIdData.aud != process.env.FEIDE_CLIENT_ID) {
                    throw new Error("The audience for the response from Feide is incorrect");
                }

                const [ userinfoBasic, userinfoExtended ] = await Promise.all([userinfoBasicRequest, userinfoExtendedRequest])

                if (!userinfoBasic.ok || !userinfoExtended.ok) {
                    throw new Error("Failed to fetch user information");
                }

                const profile = await userinfoBasic.json();

                const profileExtended = await userinfoExtended.json();

                return { ...profile, extended: profileExtended, iat: clientIdData.iat };
            }
        },
        profile(profile, token) {
            return {
                id: profile.sub,
                email: profile.email,
                emailVerified: null,
                username: profile.email.split("@")[0],
                firstname: profile.extended.givenName.join(" "),
                lastname: profile.extended.sn.join(" "),
                password: ""
            }
        },
        clientId,
        clientSecret,
    }
}
