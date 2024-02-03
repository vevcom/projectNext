import { ReactNode } from "react";
import type { Image as ImageT } from "@prisma/client";
import Image from "../Image/Image";

type PropTypes = { 
    children:ReactNode
    image:ImageT
 }

export default function BackdropImage({children, image}:PropTypes) {
    return (
        <div>
            <h1>test</h1>
            {children}
            <Image image={image} width={350} />
        </div>
    )
}