import { articleSectionsRealtionsIncluder } from "../articleSections/ConfigVars"

export const maxSections = 10 // Max 10 sections in an article

export const articleRealtionsIncluder = {
    articleSections: {
        include: articleSectionsRealtionsIncluder
    },
    coverImage: {
        include: {
            image: true
        },
    },
} as const