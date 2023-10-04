import styles from './YouTube.module.scss'

function YouTube({src}) {
  return (
    <iframe allowFullScreen className={styles.YouTube} src={src.replace('/watch?v=', '/embed/')}>YouTube</iframe>
  )
}

export default YouTube