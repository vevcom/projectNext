
import styles from './HeaderItemPopUp.module.scss'
import PopUp from '@/components/PopUp/PopUp'
import React from 'react'
import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { faArchive, faCog, faPlus, faQuestionCircle, faTag } from '@fortawesome/free-solid-svg-icons'
import type { PropTypes as PopUpProps } from '@/components/PopUp/PopUp'

type PropTypes = Omit<PopUpProps, 'showButtonContent'> & { scale?: number }

function createHeaderItemPopUp(icon: FontAwesomeIconProps['icon'], scale = 40) {
    return function HeadItemPopUp({ showButtonClass, children, scale: overrideScale, ...props }: PropTypes) {
        return <PopUp
            {...props}
            showButtonContent = {
                <FontAwesomeIcon
                    style={{
                        width: `${overrideScale ?? scale}px`,
                        height: `${overrideScale ?? scale}px`,
                    }}
                    icon={icon}
                />
            }
            showButtonStyle={{
                width: `${overrideScale ?? scale}px`,
                height: `${overrideScale ?? scale}px`,
            }}
            showButtonClass={`${styles.addBtn} ${showButtonClass}`}
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

/**
 * Component that can be used to show a settings pop up for a page
 */
export const SettingsHeaderItemPopUp = createHeaderItemPopUp(faCog, 18)

/**
 * Component that can be used to show a tag pop up for a page
 */
export const TagHeasderItemPopUp = createHeaderItemPopUp(faTag)

/**
 * Component that can be used to show a archive pop up for a page
 */
export const ArchiveHeaderItemPopUp = createHeaderItemPopUp(faArchive, 35)
