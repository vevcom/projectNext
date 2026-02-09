import styles from './YouTube.module.scss'

type PropTypes = {
	src: string,
}

function YouTube({ src }: PropTypes) {
    return <div className={styles.YouTube}>
        <iframe
            title="YouTube Video" // TODO Add name of youtube video
            allowFullScreen
            className={styles.YouTubeIframe}
            src={src.replace('/watch?v=', '/embed/')} />
    </div>
}

export default YouTube
