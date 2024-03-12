import { ReactNode } from "react";
import type { Image as ImageT } from "@prisma/client";
import Image from "../Image/Image";
import styles from "./BackdropImage.module.scss"

type PropTypes = { 
    children: ReactNode
    image: ImageT
    grayScale?: boolean
}
/**
 * A component that renders a backdrop image with a content div on top of it
 * @param children - The content to render on top of the image
 * @param image - The image to render as a backdrop
 * @param grayScale - Whether the image should be rendered in grayscale (true by default)
 * */
export default function BackdropImage({ children, image, grayScale = true }:PropTypes) {
    return (
        <div className={styles.BackdropImage}>
            <div className={styles.content}>
                {children}
            </div>
            <div className={styles.image}>
                <Image className={styles.gray} image={image} width={350} />
            </div>
        </div>
    )
}