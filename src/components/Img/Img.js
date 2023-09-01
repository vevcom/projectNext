import Image from "next/image"
import styles from "./Img.module.scss"

function Img({src, alt}) {
  return (
    <div className={styles.imageContainer}>
        <Image alt={alt ? alt : "image"} src={src} layout="fill" className={styles.image} />
    </div>
  )
}

export default Img