import read from "@/actions/images/read";
import BackdropImage from "@/components/BackdropImage/BackdropImage";
import { notDeepEqual } from "assert";
import styles from "./page.module.scss"

export default async function committees() {
    const im = await read("vevcom_logo")
    if (!im.success) {
        throw Error("man")
    }
    return (
        <div>
            <h1>jkhkjh</h1>
    
            <BackdropImage image={im.data}>
                <div className={styles.test}>

                </div>
            </BackdropImage>
        </div>
    );
}
