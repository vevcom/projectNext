import PermissionCategory from './PermissionCategory'
import { permissionCategories } from '@/server/permissionRoles/ConfigVars'
import type { PropTypes as PropTypesCategory } from './PermissionCategory'

type PropTypes = Pick<PropTypesCategory, 'renderBesidePermission'>

export default function DisplayAllPermissions({ renderBesidePermission }: PropTypes) {
    return permissionCategories.map(category =>
        <PermissionCategory key={category} category={category} renderBesidePermission={
            renderBesidePermission
        }
        />
    )
}
