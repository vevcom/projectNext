import { Awaitable } from "next-auth";
import type { Provider } from "next-auth/providers/index"
import type { User } from "next-auth"

export type PropType = {
    clientId: string,
    clientSecret: string,
}

type FeideGroup = {
    id: string,
    displayName: string,
    type: string,
    membership: {
        basic: string,
        active: boolean,
        displayName: string,
    }
}

type FeideGroups = Array<FeideGroup>

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

                console.log(tokens);

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

                const userinfoGroupsRequest = fetch("https://groups-api.dataporten.no/groups/me/groups", {
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

                const [ userinfoBasic, userinfoExtended, userinfoGroups ] = await Promise.all([userinfoBasicRequest, userinfoExtendedRequest, userinfoGroupsRequest])

                if (!userinfoBasic.ok || !userinfoExtended.ok || !userinfoGroups.ok) {
                    throw new Error("Failed to fetch user information");
                }

                const profile = await userinfoBasic.json();

                const profileExtended = await userinfoExtended.json();

                const groups : FeideGroups = await userinfoGroups.json();

                let studyProgram;

                for (let group of groups) {
                    const groupSplit = group.id.split(":");
                    // I wonder id a user can have mulitple study programs
                    if (group.type == "fc:fs:prg" && groupSplit[4] == "ntnu.no" && group.membership.active) {
                        const studyProgramCode = groupSplit[5];
                        
                        studyProgram = await prisma.studyProgram.findUnique({
                            where: {
                                code: studyProgramCode,
                            }
                        })

                        if (!studyProgram) {
                            studyProgram = await prisma.studyProgram.create({
                                data: {
                                    name: group.displayName,
                                    code: studyProgramCode,
                                }
                            })
                            console.log("Created new study program: ", studyProgram);
                        }
                        break;
                    }
                }

                return { ...profile, extended: profileExtended, groups, studyProgram };
            }
        },
        profile(profile, token) : Awaitable<User> {

            return {
                id: profile.sub,
                email: profile.email,
                username: profile.email.split("@")[0], //
                firstname: profile.extended.givenName.join(" "),
                lastname: profile.extended.sn.join(" "),
            }
        },
        clientId,
        clientSecret,
    }
}
