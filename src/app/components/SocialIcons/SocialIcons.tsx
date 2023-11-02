import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faXTwitter,
    faFacebookSquare,
    faInstagram
} from '@fortawesome/free-brands-svg-icons'

function SocialIcons() {
    return (
        <>
            <Link href="https://twitter.com/OmegaVevcom" target="_blank">
                <FontAwesomeIcon icon={faXTwitter} />
            </Link>
            <Link href="https://www.facebook.com/SctOmegaBroderskab/" target="_blank">
                <FontAwesomeIcon icon={faFacebookSquare} />
            </Link>
            <Link href="https://www.instagram.com/sctomega/" target="_blank">
                <FontAwesomeIcon icon={faInstagram} />
            </Link>
        </>
    )
}

export default SocialIcons
