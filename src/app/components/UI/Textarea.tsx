import styles from "./Textarea.module.scss"
import { TextareaHTMLAttributes } from "react";

type PropTypes = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string
}

export default function Textarea({label, ...props} : PropTypes) {
    return (
        <div className={styles.TextArea}>
            <label>{ label }</label>
            <textarea {...props}></textarea>
        </div>
    );
}