
import styles from './HeaderItemPopUp.module.scss'
import PopUp from '@/components/PopUp/PopUp'
import React from 'react'
import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { faPlus, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import type { PropTypes as PopUpProps } from '@/components/PopUp/PopUp'

type PropTypes = Omit<PopUpProps, 'showButtonContent' | 'showButtonClass'>

function createHeaderItemPopUp(icon: FontAwesomeIconProps['icon'], scale = 40) {
    return function HeadItemPopUp({ children, ...props }: PropTypes) {
        return <PopUp
            {...props}
            showButtonContent = {
                <FontAwesomeIcon
                    style={{
                        '--scale': scale,
                    } as React.CSSProperties}
                    className={styles.addIcon}
                    icon={icon}
                />
            }
            showButtonStyle={{
                '--scale': scale,
            } as React.CSSProperties}
            showButtonClass={styles.addBtn}
        >
            { children }
        </PopUp>
    }
}

/**
 * Component that is a popup using the + icon mostly used as header items to
 * f.ex add users or create new ombul, image, ...
 * Often a Form will be rendered as children
 */
export const AddHeaderItemPopUp = createHeaderItemPopUp(faPlus)

/**
 * Component that can be used to show a help pop up for a page
 */
export const HelpHeaderItemPopUp = createHeaderItemPopUp(faQuestionCircle, 18)
