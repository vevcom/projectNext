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
            <h1>test</h1>
            {children}
            <div className={styles.image}>
                <Image image={image} width={350} />
            </div>
        </div>
    )
}