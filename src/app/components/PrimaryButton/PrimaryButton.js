import styles from "./PrimaryButton.module.scss"

function PrimaryButton({ text }) {

    return <button className={styles.Button}>{ text }</button>
}

export default PrimaryButton