import PermissionCategory from './PermissionCategory'
import { permissionCategories } from '@/services/permissions/config'
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
