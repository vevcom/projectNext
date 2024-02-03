import { ReactNode } from "react";
import type { Image as ImageT } from "@prisma/client";
import Image from "../Image/Image";
import styles from "./BackdropImage.module.scss"

type PropTypes = { 
    children:ReactNode
    image:ImageT
 }

export default function BackdropImage({children, image}:PropTypes) {
    return (
        <div className={styles.BackdropImage}>
            <div className={styles.content}>
                {children}
            </div>
            <div className={styles.image}>
                <Image image={image} width={350} />
            </div>
        </div>
    )
}