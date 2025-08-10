'use client'
import styles from './SlideSidebar.module.scss'
import useOnNavigation from '@/hooks/useOnNavigation'
import { Fragment, useRef, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBeer,
    faChild,
    faKey,
    faNewspaper,
    faUser,
    faUserGroup,
    faArrowLeft,
    faPaperPlane,
    faSchool,
    faDotCircle,
    faHouse,
    faShop,
    faListDots,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type { ReactNode } from 'react'

/**
 * Declaration for the admin navigation links.
 */
const navigations = [
    {
        header: {
            icon: faUser,
            title: 'Brukere'
        },
        links: [
            {
                title: 'Brukere',
                href: '/admin/users'
            }
        ],
    },
    {
        header: {
            icon: faNewspaper,
            title: 'CMS'
        },
        links: [
            {
                title: 'Rediger cms',
                href: '/admin/cms'
            }
        ],
    },
    {
        header: {
            icon: faBeer,
            title: 'Komitéer'
        },
        links: [
            {
                title: 'Opprett komité',
                href: '/admin/committees'
            }
        ],
    },
    {
        header: {
            icon: faChild,
            title: 'Opptak'
        },
        links: [
            {
                title: 'Phaestum',
                href: '/admin/phaestum'
            },
            {
                title: 'Opptak',
                href: '/admin/admission'
            },
            {
                title: 'Omegas tilstand',
                href: '/admin/stateOfOmega'
            }
        ],
    },
    {
        header: {
            icon: faUserGroup,
            title: 'Grupper'
        },
        links: [
            {
                title: 'Grupper',
                href: '/admin/groups'
            },
            {
                title: 'Klasser',
                href: '/admin/classes'
            },
            {
                title: 'Studieprogrammer',
                href: '/admin/study-programmes'
            }
        ],
    },
    {
        header: {
            icon: faKey,
            title: 'Tillgangsstyring'
        },
        links: [
            {
                title: 'Gruppe Tilganger',
                href: '/admin/group-permissions'
            },
            {
                title: 'Standard Tilganger',
                href: '/admin/default-permissions'
            },
            {
                title: 'Api Nøkler',
                href: '/admin/api-keys'
            },
        ],
    },
    {
        header: {
            icon: faPaperPlane,
            title: 'Varslinger'
        },
        links: [
            {
                title: 'Send varsel',
                href: '/admin/send-notification'
            },
            {
                title: 'Varslingkanaler',
                href: '/admin/notification-channels'
            },
            {
                title: 'Mailing lister',
                href: '/admin/mail'
            },
            {
                title: 'Send e-post',
                href: '/admin/send-mail'
            }
        ]
    }, {
        header: {
            icon: faSchool,
            title: 'Fagvev'
        },
        links: [
            {
                title: 'Skoler',
                href: '/admin/schools'
            },
            {
                title: 'Emnekatalog',
                href: '/admin/courses'
            }
        ],
    },
    {
        header: {
            icon: faDotCircle,
            title: 'Prikker'
        },
        links: [
            {
                title: 'Prikker',
                href: '/admin/dots'
            },
            {
                title: 'Frysperioder',
                href: '/admin/dots-freeze-periods'
            },
        ]
    },
    {
        header: {
            icon: faHouse,
            title: 'Heutte'
        },
        links: [
            {
                title: 'Perioder',
                href: '/admin/cabin-periods',
            },
            {
                title: 'Produkter',
                href: '/admin/cabin-product',
            },
            {
                title: 'Bookinger',
                href: '/admin/cabin-booking',
            },
        ]
    },
    {
        header: {
            icon: faShop,
            title: 'Shop'
        },
        links: [
            {
                title: 'Butikker',
                href: '/admin/shop'
            },
            {
                title: 'Produkter',
                href: '/admin/product'
            },
        ]
    },
    {
        header: {
            title: 'Annet',
            icon: faListDots
        },
        links: [
            {
                title: 'Lisenser',
                href: '/admin/licenses'
            },
        ]
    }
] satisfies {
    header: {
        icon: IconDefinition
        title: string
    },
    links: {
        title: string
        href: string
    }[]
}[]

type PropTypes = {
    currentPath: string
    children: ReactNode
}

/**
 * Component that renders a sidebar that can be toggled on and off.
 * @param children - The children to render in the sidebar.
 * @returns
 */
export default function SlideSidebar({ currentPath, children }: PropTypes) {
    const [open, setOpen] = useState(true)
    const previousPath = useRef<string>(currentPath)

    useOnNavigation(() => {
        if (previousPath.current === 'admin' && currentPath !== 'admin') {
            setOpen(false)
        }
        if (currentPath === 'admin') {
            setOpen(true)
        }
        previousPath.current = currentPath
    })

    const handleToggle = () => {
        setOpen(!open)
    }

    return (
        <>
            <div className={open ? `${styles.SlideSidebar} ${styles.open}` : `${styles.SlideSidebar} ${styles.closed}`}>
                <aside className={styles.sidebar}>
                    {
                        navigations.map(navigation => (
                            <Fragment key={navigation.header.title}>
                                <h3 className={styles.header}>
                                    <FontAwesomeIcon icon={navigation.header.icon} />
                                    {navigation.header.title}
                                </h3>
                                {
                                    navigation.links.map(link => (
                                        <Link
                                            key={link.title}
                                            href={link.href}
                                            className={link.href === `/admin/${currentPath}` ? styles.active : ''}
                                        >
                                            {link.title}
                                        </Link>
                                    ))
                                }
                            </Fragment>
                        ))
                    }
                </aside>
                {
                    !(currentPath === 'admin' && open) && (
                        <button onClick={handleToggle} className={styles.toggle}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                    )
                }

            </div>
            <div className={open ? `${styles.content} ${styles.open}` : `${styles.content} ${styles.closed}`}>
                {children}
            </div>
        </>
    )
}
