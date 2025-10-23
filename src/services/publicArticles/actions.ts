'use server'
import { publicArticleOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const readPublicArticle = makeAction(
    publicArticleOperations.read
)

export const updatePublicArticleAction = makeAction(
    publicArticleOperations.update.update
)
export const updatePublicArticleAddSectionAction = makeAction(
    publicArticleOperations.update.addSection
)
export const updatePublicArticleReorderSectionsAction = makeAction(
    publicArticleOperations.update.reorderSections
)
export const updatePublicArticleCoverImageAction = makeAction(
    publicArticleOperations.update.coverImage
)
export const updatePublicArticleSectionAction = makeAction(
    publicArticleOperations.update.articleSections.update
)
export const updatePublicArticleSectionsAddPartAction = makeAction(
    publicArticleOperations.update.articleSections.addPart
)
export const updatePublicArticleSectionsRemovePartAction = makeAction(
    publicArticleOperations.update.articleSections.removePart
)
export const updatePublicArticleCmsImageAction = makeAction(
    publicArticleOperations.update.articleSections.cmsImage
)
export const updatePublicArticleCmsParagraphAction = makeAction(
    publicArticleOperations.update.articleSections.cmsParagraph
)
export const updatePublicArticleCmsLinkAction = makeAction(
    publicArticleOperations.update.articleSections.cmsLink
)
