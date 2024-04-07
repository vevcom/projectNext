
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./deletableList.module.scss"
import { v4 as uuid } from "uuid"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

export function DeleteableList<V extends number | string>({
    items,
    deleteFunction,
}: {
    items: {
        label: string,
        id: V,
    }[],
    deleteFunction: (id: V) => void,
}) {

    return <ul className={styles.deleteableList}>
        {items.map(item => {
            return <li key={uuid()}>
                <FontAwesomeIcon icon={faTrash} onClick={() => deleteFunction(item.id)}/>
                <span>{item.label}</span>
            </li>
        })}
    </ul>
}