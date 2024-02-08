# CMS and articles
The cms of projectnext consists of three basis elements: CmsImages, CmsParagraphs, and CmsLinks. Each having a model in the database an a corresponding component. These basis elements may be used on their own or be combined into an ArticleSection and further to a full Article.

## Images
A cmsImage (not to be confused with a standard image from the image system - [read more](../Database_and_Store/Image_System.md)) is a model that holds a relation to a image from the image system. It is essentially a wrapper for the Image model. The point is just that it can changed what image it "relates" to. If the CmsImage does not relate to any image a fallback will be displayed. A user can change the image contained in a cmsImage by going into "edit mode".

The CmsImage component takes a name to a CmsImage and displays it. Note that when a CmsImage is rendered with a name.If it does not exist it is created with a null Image relation.

## Paragraphs
A CmsParagraph holds markdown and html. The user is allowed to edit a CmsParagraph using markdown and on upload the server action changes the markdown to html. Both are stored so the html can be quickly displayed by the CmsParagraph and the CmsParagraphEditor can pull up the markdown content when in editmode.

## Links
A Cms Link just holds a link to a webpage and some text to display. Note that links with . are interpreted as external by the actions, adt the once without as internal

(MOR LINK FUNCTIONALITY NOT IMPLEMENTED)