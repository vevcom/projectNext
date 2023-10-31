import styles from './YouTube.module.scss'

type PropTypes = {
	src: string,
}

function YouTube({src}: PropTypes) {
    return (
        <iframe allowFullScreen className={styles.YouTube} src={src.replace('/watch?v=', '/embed/')}>YouTube</iframe>
    )
}

export default YouTube