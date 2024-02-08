# Articles and News
Article sections, articles and news are the highest abstractions in the cms system.

## Article Sections
A article section is a model that contains *optionally* a CmsImage, CmsParagraph and CmsLink. That is: a ArticleSection can include a CmsParagraph but does not have to. Any combination of the three is allowed. However note the property *destroyOnEmpty* It tells the actions to destroy the section if it suddenly has neither paragraph, link, nor image. This attribute is on by default and is good behavior when an articleSection is used in an Article, but if you need a ArticleSection by itself in some place you should probably have that attribute turned of.

An ArticleSection is displayed using the ArticleSection component. It takes a ArticleSection and displays it in a meaningful way using th CmsImage, CmsParagraph and CmsLink components. The ArticleSection also incudes attributes that tells how to display the ArticleSection imageSize and imagePosition tells which size and which position a image (if it is included) should display in. It can be changed by the user when ArticleSection is in "EditMode".

## Articles
An article is just a model that has many ArticleSections in a order. Th order is saved on each ArticleSection and tells the Article component in what order to display the sections. The article component takes in one article and displays it using ArticleSectionComponents. Note that orders of ArticleSections in an article does not neccesserally go: 1,2,3,4 but may go: 1,3,4,7. The order is the important thing not the numbers. An Article also includes a coverImge that is a CmsImage.

## Article Categories

## News

## seeding
Obiously we need some standard articles when we create projectnext from scratch with the database empty, this work is done by [the seeder](../Database_and_Store/Seeding_and_Prismaservice.md)