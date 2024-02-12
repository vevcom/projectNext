import styles from './page.module.scss';
type PropTypes = {
    params: {
        name: string
    }
}


export default function JobAd({ params }: PropTypes) {
    return (
        <div className={styles.wrapper}>
            <h1>JobAd {params.name}</h1>
        </div>
    )
}