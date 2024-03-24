import 'server-only'
import { VisibilityCollapsed } from '@/server/visibility/Types';
import { BasicMembership } from '@/server/groups/Types';

/**
 * Check if a user meets the visibility requirements of a visibility
 * @param memberships - the memberships of the user. Remember if using getUser and there is no user 
 * getUser and useUser will return an empty array
 * @param visibility - the visibility to require
 */
export function requireVisibility(memberships: BasicMembership[], visibility: VisibilityCollapsed) {

    

}