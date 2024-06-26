import styles from './YouTube.module.scss'

type PropTypes = {
	src: string,
}

function YouTube({ src }: PropTypes) {
    return <div className={styles.YouTube}>
        <iframe allowFullScreen className={styles.YouTubeIframe} src={src.replace('/watch?v=', '/embed/')} />
    </div>
}

export default YouTube
