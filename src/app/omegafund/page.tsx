import styles from './page.module.scss'

export default function OmegaFund() {
    return (
        <div className= {styles.wrapper}>
            <h1>Omegafondet</h1>
            <iframe
                src="https://www.shareville.no/widget/portfolio/590617/yield?period=180"
                allowFullScreen
                className={styles.omegafundIframe}
            >
            </iframe>
        </div>
    )
}
