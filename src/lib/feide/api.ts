import '@pn-server-only'

/**
 * The attributes returned by the extended user info endpoint.
 * All possible attributes are documented [here](https://docs.feide.no/reference/schema/attributes/index.html).
 * Only a small subset of these will be available based on the scopes of the access token.
 * Only the attributes we use should be listed in the type.
 */
type ExtendedUserInfo = Record<string, unknown> & {
    cn?: string[], // Common name
    displayName?: string,
    eduPersonAffiliation?: string[],
    eduPersonPrimaryAffiliation?: string,
    eduPersonScopedAffiliation?: string[],
    givenName?: string[], // Aka firstname
    mail?: string[],
    norEduPersonLegalName?: string,
    schacHomeOrganization?: string,
    sn?: string[], // Surname
}

/**
 * Retrives extended user info from Feide API.
 *
 * @param accessToken - The access token of a Feide account.
 * @returns Extended user info object.
 */
export async function fetchExtendedUserInfoFromFeide(accessToken: string): Promise<ExtendedUserInfo> {
    const extendedUserInfoRequest = await fetch('https://api.dataporten.no/userinfo/v1/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    })

    if (!extendedUserInfoRequest.ok) {
        throw new Error(`Could not fetch extended user info from feide. Status: ${extendedUserInfoRequest.status}`)
    }

    return await extendedUserInfoRequest.json()
}

/**
 *
 */
type FeideGroup = Record<string, unknown> & {
    id: string,
    displayName: string,
    type?: string,
    parent?: string,
    membership?: Record<string, unknown>
}

/**
 * Retrives groups of a user from Feide API.
 *
 * @param accessToken - The access token of a Feide account.
 * @returns An array of groups.
 */
export async function fetchGroupsFromFeide(accessToken: string): Promise<FeideGroup[]> {
    const groupsRequest = await fetch('https://groups-api.dataporten.no/groups/me/groups', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    })

    if (!groupsRequest.ok) {
        throw new Error(`Could not fetch groups from feide. Status: ${groupsRequest.status}`)
    }

    return groupsRequest.json()
}

/**
 * A wrapper for `fetchGroupsFromFeide` witch returns an array of studyprogrammes
 * that the user is currently part of.
 *
 * @param accessToken - The access token of a Feide account.
 */
export async function fetchStudyProgrammesFromFeide(accessToken: string): Promise<{ code: string, name: string}[]> {
    return (await fetchGroupsFromFeide(accessToken))
        // Filter out groups which are not study programmes (for example courses) and
        // also not part of ntnu.
        .filter(({ type, id }) => type === 'fc:fs:prg' && id.split(':')[4] === 'ntnu.no')
        // Map each study programme to an easily readable form
        .map(({ id, displayName }) => ({
            code: id.split(':')[5],
            name: displayName,
        }))
}
