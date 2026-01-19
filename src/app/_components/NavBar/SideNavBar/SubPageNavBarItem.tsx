'use client'
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import styles from "./SubPageNavBarItem.module.scss";
import { usePathname } from "next/navigation";

interface NavBarItemProps {
    children?:  ReactNode,
    icon?:      IconProp,
    href?:      string
}

export default function SubPageNavBarItem({children, icon, href}:NavBarItemProps) {
    const pathname = usePathname();
    const page = pathname.split('/').pop();
    const thisPage = href?.split('/').pop();
    console.log(page + " " + thisPage + " " + (thisPage == page));
    return (
        <div className={styles.linkContainer}>
            <a href={href} className={styles.link}>
                <div className={`${styles.container} ${page == thisPage ? styles.selected : styles.notSelected}`}>
                    {icon?<FontAwesomeIcon icon={icon} className={styles.icon} />: <></>}
                    <p className={styles.text}>{children}</p>
                </div>
            </a>
        </div>
    );
}