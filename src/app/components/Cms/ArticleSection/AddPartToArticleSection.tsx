
import { useCallback } from 'react'
import { addPart } from '@/cms/articleSections/update'
import { useRouter } from 'next/navigation'
import type { PropTypes as AddPartsPropTypes } from '@/cms/AddParts'
import AddParts from '@/cms/AddParts'
import type { Part } from '@/actions/cms/articleSections/update'

type PropTypes = Omit<AddPartsPropTypes, 'onClick'> & {
    articleSectionName: string
}

export default function AddPartToArticleSection({ articleSectionName, ...props }: PropTypes) {
    const { refresh } = useRouter()
    
    const handleAdd = useCallback(async (part: Part) => {
        await addPart(articleSectionName, part)
        refresh()
    }, [articleSectionName])
  
    return (
        <AddParts onClick={handleAdd} {...props} />
    )
}

