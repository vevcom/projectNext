import styles from './AddHeaderItemPopUp.module.scss'
import PopUp from '@/components/PopUp/PopUp'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import type { PropTypes as PopUpProps } from '@/components/PopUp/PopUp'

type PropTypes = Omit<PopUpProps, 'showButtonContent' | 'showButtonClass'>

/**
 * Component that is a popup using the + icon mostly used as header items to
 * f.ex add users or create new ombul, image, ...
 * Often a Form will be rendered as children
 */
export default function AddHeaderItemPopUp({ children, ...props }: PropTypes) {
    return (
        <PopUp
            {...props}
            showButtonContent = {
                <FontAwesomeIcon className={styles.addIcon} icon={faPlus} />
            }
            showButtonClass={styles.addBtn}
        >
            { children }
        </PopUp>
    )
}
