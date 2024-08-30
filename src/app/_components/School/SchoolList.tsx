'use client'
import type { ReactNode } from "react";
import { SchoolPagingContext } from "@/contexts/paging/SchoolPaging";
import EndlessScroll from "../PagingWrappers/EndlessScroll";
import styles from './SchoolList.module.scss'
import { schoolListRenderer } from "./SchoolListRenderer";

type PropTypes = {
    serverRendered: ReactNode
}

/**
 * WARNING: This component needs SchoolPagingContext to work properly
 * @param serverRendered - Make sure to pass the server rendered schools here in the correct format
 * You may use the schoolListRenderer to make sure of this
 * @returns 
 */
export default function SchoolList({ serverRendered }: PropTypes) {
    return (
        <div className={styles.SchoolList}>
            {serverRendered}
            <EndlessScroll renderer={schoolListRenderer(true)} pagingContext={SchoolPagingContext} />
        </div>
    )
}