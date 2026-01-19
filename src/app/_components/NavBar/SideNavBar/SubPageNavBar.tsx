import { ReactNode } from "react";
import styles from "./SubPageNavBar.module.scss"

export default function SubPageNavBar({children}: {children: ReactNode}) {
    return (<>
        <div className={styles.navBarContainer}>
            {children}
        </div>
    </>);
}