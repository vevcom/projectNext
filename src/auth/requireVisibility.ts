import { VisibilityCollapsed } from '@/server/visibility/Types';
import 'server-only'
import { ExpandedUser } from './getUser';

/**
 * Check if a user meets the visibility requirements of a visibility
 * @param user - the user to check visibility for (expanded user including its memberships). 
 * If the user is null, it will naturally be assumed that the groups of the user is [].
 * @param visibility - the visibility to require
 */
export function requireVisibility(user: ExpandedUser | null, visibility: VisibilityCollapsed) {

    

}