//This file defines all the routes for the navbar and menu
//Higher placment in array gives hight priority on where it is placed (ie menu vs. navbar)
//does not include / or /login (or profile route) as they are always shown and ar special
import {
    faGamepad,
    faBook,
    faPoo,
    faShoppingCart,
    faComment,
    faQuestionCircle,
    faCamera,
    faList,
    faUsers,
    faCircleInfo,
    IconDefinition,
    faNewspaper,
    faCalendar,
    faSuitcase,
    faAddressCard,
    faBeer,
    faBriefcase,
    faGraduationCap,
    faTools,
} from '@fortawesome/free-solid-svg-icons'

type showTypes = 'all' | 'loggedOut' | 'loggedIn' | 'applicationPeriodAndLoggedIn' | 'admin'
export type NavItem = {
    name: string,
    href: string,
    show: showTypes,
    icon: IconDefinition,
}

export const itemsForMenu : NavItem[] = [
    {
        name: 'Hvad der hender',
        href: '/events',
        show: 'loggedIn',
        icon: faCalendar,
    },
    {
        name: 'Komitéer',
        href: '/committees',
        show: 'all',
        icon: faBeer,
    },
    {
        name: 'Jobbannonser',
        href: '/jobads',
        show: 'loggedIn',
        icon: faBriefcase,
    },
    {
        name: 'Søknader',
        href: '/applications',
        show: 'applicationPeriodAndLoggedIn',
        icon: faAddressCard,
    },
    {
        name: 'For Bedrifter',
        href: '/contactor',
        show: 'loggedOut',
        icon: faSuitcase,
    },
    {
        name: 'Ny Student?',
        href: '/infopages/nystudent',
        show: 'loggedOut',
        icon: faGraduationCap,
    },
    {
        name: 'Ombul',
        href: '/infopages/about',
        show: 'all',
        icon: faBook,
    },
    {
        name: 'Intressegrupper',
        href: '/infopages/interessegrupper',
        show: 'all',
        icon: faGamepad,
    },
    {
        name: 'Artikler',
        href: '/articles',
        show: 'all',
        icon: faNewspaper
    },
    {
        name: 'Bulshit',
        href: '/bulshit',
        show: 'all',
        icon: faPoo,
    },
    {
        name: 'Omegashop',
        href: '/money/shop',
        show: 'loggedIn',
        icon: faShoppingCart,
    },
    {
        name: 'Omegaquotes',
        href: '/omegaquotes',
        show: 'loggedIn',
        icon: faComment,
    },
    {
        name: 'Guider',
        href: 'infopages/guides',
        show: 'all',
        icon: faQuestionCircle,
    },
    {
        name: 'Bilder',
        href: '/images',
        show: 'all',
        icon: faCamera,
    },
    {
        name: 'Klasselister',
        href: '/userlist',
        show: 'loggedIn',
        icon: faList,
    },
    {
        name: 'Komitémedlemmer',
        href: '/committees',
        show: 'loggedIn',
        icon: faUsers,
    },
    {
        name: 'Om Omega',
        href: 'ingopages/about',
        show: 'all',
        icon: faCircleInfo,
    },
    {
        name: 'Intressegrupper',
        href: 'ingopages/interessegrupper',
        show: 'all',
        icon: faGamepad,
    },
    {
        name: 'Admin',
        href: '/admin',
        show: 'admin',
        icon: faTools,
    }
]

export default function getNavItems(loggedIn: boolean, admin: boolean, applicationPeiod: boolean) : NavItem[] {
    return itemsForMenu.filter(item => {
        switch (item.show) {
            case 'all':
                return true
            case 'loggedOut':
                return !loggedIn
            case 'loggedIn':
                return loggedIn
            case 'applicationPeriodAndLoggedIn':
                return loggedIn && applicationPeiod
            case 'admin':
                return admin
            default:
                //item.show should be of type never
                return true
        }
    })
}
