import styles from "./PrimaryButton.module.scss"

type PropTypes = {
    text: string,
}
function PrimaryButton({ text }:PropTypes) {

    return <button className={styles.Button}>{ text }</button>
}

export default PrimaryButton