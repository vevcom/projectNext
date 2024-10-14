import styles from './page.module.scss'

export default function dotsFreezePeriods() {
    return (
        <div className={styles.wrapper}>
            <h1>Frysperioder for prikker</h1>
            <p>Dette er perioder der prikker ikke fjernes</p>
        </div>
    )
}
