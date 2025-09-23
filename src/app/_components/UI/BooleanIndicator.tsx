import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
    value: boolean,
}

export default function BooleanIndicator({ value }: Props) {
    return value
        ? <FontAwesomeIcon icon={faCheck} color="green" />
        : <FontAwesomeIcon icon={faXmark} color="red" />
}
