'use client'
import styles from './ImageControls.module.scss'
import { ReactNode } from 'react'
import update from '@/actions/cms/articleSections/update';


type PropTypes = {
    children: ReactNode
}

export default function ImageControls({ children } : PropTypes) {
    return (
        <div>ImageControls</div>
    )
}
