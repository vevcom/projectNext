
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Admission" AS ENUM ('PLIKTTIAENESTE', 'PROEVELSEN');

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('CABIN', 'BED', 'EVENT');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'OTHER');

-- CreateEnum
CREATE TYPE "SpecialCmsImage" AS ENUM ('FRONTPAGE_1', 'FRONTPAGE_2', 'FRONTPAGE_3', 'FRONTPAGE_4', 'FOOTER_SPONSOR_1', 'FOOTER_SPONSOR_2', 'FOOTER_SPONSOR_3');

-- CreateEnum
CREATE TYPE "SpecialCmsParagraph" AS ENUM ('FRONTPAGE_1', 'FRONTPAGE_2', 'FRONTPAGE_3', 'FRONTPAGE_4', 'INTEREST_GROUP_GENERAL_INFO', 'CAREER_INFO', 'CABIN_CONTRACT');

-- CreateEnum
CREATE TYPE "SpecialCmsLink" AS ENUM ('CAREER_LINK_TO_CONTACTOR');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('LEFT', 'RIGHT');

-- CreateEnum
CREATE TYPE "SpecialCmsArticle" AS ENUM ('REPORT_PAGE', 'NEW_STUDENT_PAGE');

-- CreateEnum
CREATE TYPE "EventCanView" AS ENUM ('CAN_REGISTER', 'ALL');

-- CreateEnum
CREATE TYPE "SpecialEventTags" AS ENUM ('COMPANY_PRESENTATION');

-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('CLASS', 'COMMITTEE', 'INTEREST_GROUP', 'MANUAL_GROUP', 'OMEGA_MEMBERSHIP_GROUP', 'STUDY_PROGRAMME');

-- CreateEnum
CREATE TYPE "OmegaMembershipLevel" AS ENUM ('SOELLE', 'MEMBER', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "StandardImage" AS ENUM ('DEFAULT_IMAGE', 'DEFAULT_IMAGE_COLLECTION_COVER', 'DEFAULT_PROFILE_IMAGE', 'DEFAULT_COMMITTEE_LOGO', 'LOGO_SIMPLE', 'LOGO_WHITE', 'LOGO_WHITE_TEXT', 'MAGISK_HATT', 'HOVEDBYGGNINGEN', 'BOOKS', 'REALFAGSBYGGET', 'MACHINE', 'FAIR', 'PWA');

-- CreateEnum
CREATE TYPE "SpecialCollection" AS ENUM ('STANDARDIMAGES', 'OMBULCOVERS', 'PROFILEIMAGES', 'COMMITTEELOGOS', 'FLAIRIMAGES');

-- CreateEnum
CREATE TYPE "ImageSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "SpecialNotificationChannel" AS ENUM ('ROOT', 'NEW_EVENT', 'NEW_OMBUL', 'NEW_NEWS_ARTICLE', 'NEW_JOBAD', 'NEW_OMEGAQUOTE', 'EVENT_WAITINGLIST_PROMOTION', 'CABIN_BOOKING_CONFIRMATION');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('JOBAD_CREATE', 'JOBAD_READ', 'JOBAD_UPDATE', 'JOBAD_DESTROY', 'OMEGAQUOTES_WRITE', 'OMEGAQUOTES_READ', 'OMBUL_CREATE', 'OMBUL_READ', 'OMBUL_UPDATE', 'OMBUL_DESTROY', 'GROUP_READ', 'GROUP_DESTROY', 'GROUP_ADMIN', 'OMEGA_ORDER_READ', 'OMEGA_ORDER_CREATE', 'CLASS_CREATE', 'CLASS_READ', 'CLASS_UPDATE', 'CLASS_DESTROY', 'COMMITTEE_CREATE', 'COMMITTEE_READ', 'COMMITTEE_UPDATE', 'COMMITTEE_DESTROY', 'INTEREST_GROUP_ADMIN', 'INTEREST_GROUP_READ', 'OMEGA_MEMBERSHIP_GROUP_READ', 'OMEGA_MEMBERSHIP_GROUP_UPDATE', 'STUDY_PROGRAMME_CREATE', 'STUDY_PROGRAMME_READ', 'STUDY_PROGRAMME_UPDATE', 'STUDY_PROGRAMME_DESTROY', 'LOCKER_ADMIN', 'LOCKER_USE', 'FRONTPAGE_ADMIN', 'USERS_READ', 'USERS_UPDATE', 'USERS_DESTROY', 'USERS_CREATE', 'IMAGE_COLLECTION_CREATE', 'IMAGE_ADMIN', 'EVENT_CREATE', 'EVENT_ADMIN', 'EVENT_READ', 'EVENT_REGISTRATION_CREATE', 'EVENT_REGISTRATION_DESROY', 'EVENT_REGISTRATION_READ', 'NOTIFICATION_CHANNEL_CREATE', 'NOTIFICATION_CHANNEL_UPDATE', 'NOTIFICATION_SUBSCRIPTION_READ', 'NOTIFICATION_SUBSCRIPTION_READ_OTHER', 'NOTIFICATION_SUBSCRIPTION_UPDATE', 'NOTIFICATION_SUBSCRIPTION_UPDATE_OTHER', 'NOTIFICATION_CREATE', 'MAIL_SEND', 'MAILALIAS_READ', 'MAILALIAS_ADMIN', 'MAILINGLIST_READ', 'MAILINGLIST_ADMIN', 'MAILADDRESS_EXTERNAL_CREATE', 'MAILADDRESS_EXTERNAL_READ', 'MAILADDRESS_EXTERNAL_UPDATE', 'MAILADDRESS_EXTERNAL_DESTROY', 'ADMISSION_TRIAL_CREATE', 'APIKEY_ADMIN', 'SCREEN_READ', 'SCREEN_ADMIN', 'SCHOOLS_READ', 'SCHOOLS_ADMIN', 'COURSES_READ', 'COURSES_ADMIN', 'COMPANY_READ', 'COMPANY_ADMIN', 'DOTS_ADMIN', 'CABIN_CALENDAR_READ', 'CABIN_BOOKING_CABIN_CREATE', 'CABIN_BOOKING_BED_CREATE', 'CABIN_BOOKING_ADMIN', 'CABIN_ADMIN', 'CABIN_PRODUCTS_ADMIN', 'SHOP_READ', 'SHOP_ADMIN', 'PRODUCT_READ', 'PRODUCT_ADMIN', 'PURCHASE_CREATE', 'PURCHASE_CREATE_ONBEHALF', 'LICENSE_ADMIN', 'PERMISSION_GROUP_READ', 'PERMISSION_GROUP_ADMIN', 'PERMISSION_DEFAULT_ADMIN', 'APPLICATION_ADMIN', 'APPLICATION_WRITE', 'PUBLIC_ARTICLE_ADMIN', 'FLAIR_ADMIN', 'NEWS_CREATE', 'NEWS_ADMIN');

-- CreateEnum
CREATE TYPE "StandardSchool" AS ENUM ('NTNU');

-- CreateEnum
CREATE TYPE "ScreenOrientation" AS ENUM ('PORTRAIT', 'LANDSCAPE');

-- CreateEnum
CREATE TYPE "ScreenPageType" AS ENUM ('IMAGE', 'TEXT_AND_IMAGE', 'JOBAD', 'EVENT', 'EVENT_TAG');

-- CreateEnum
CREATE TYPE "PurchaseMethod" AS ENUM ('WEB', 'STUDENT_CARD', 'OMEGA_ID');

-- CreateEnum
CREATE TYPE "SEX" AS ENUM ('FEMALE', 'MALE', 'OTHER');

-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('NOT_SPECIFIED', 'SINGLE', 'TAKEN', 'ITS_COMPLICATED');

-- CreateEnum
CREATE TYPE "VisibilityRequirementGroupType" AS ENUM ('ACTIVE', 'ORDER');

-- CreateTable
CREATE TABLE "AdmissionTrial" (
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "registeredById" INTEGER,
    "admission" "Admission" NOT NULL
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "keyHashEncrypted" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "permissions" "Permission"[],
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationPeriod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "endPriorityDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommitteeParticipationInApplicationPeriod" (
    "id" SERIAL NOT NULL,
    "committeeId" INTEGER NOT NULL,
    "applicationPeriodId" INTEGER NOT NULL,

    CONSTRAINT "CommitteeParticipationInApplicationPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "applicationPeriodCommiteeId" INTEGER NOT NULL,
    "applicationPeriodId" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReleasePeriod" (
    "id" SERIAL NOT NULL,
    "releaseTime" TIMESTAMP(3) NOT NULL,
    "releaseUntil" DATE NOT NULL,

    CONSTRAINT "ReleasePeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricePeriod" (
    "id" SERIAL NOT NULL,
    "validFrom" DATE NOT NULL,

    CONSTRAINT "PricePeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CabinProductPrice" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "cabinProductId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "cronInterval" TEXT NOT NULL DEFAULT '* * *',
    "memberShare" INTEGER NOT NULL,
    "pricePeriodId" INTEGER NOT NULL,

    CONSTRAINT "CabinProductPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CabinProduct" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BookingType" NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "CabinProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingProduct" (
    "bookingId" INTEGER NOT NULL,
    "cabinProductId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "type" "BookingType" NOT NULL,
    "start" DATE NOT NULL,
    "end" DATE NOT NULL,
    "userId" INTEGER,
    "guestUserId" INTEGER,
    "numberOfMembers" INTEGER NOT NULL,
    "numberOfNonMembers" INTEGER NOT NULL,
    "notes" TEXT,
    "tenantNotes" TEXT NOT NULL DEFAULT '',
    "transactionTimeout" TIMESTAMP(3),
    "canceled" TIMESTAMP(3),
    "eventId" INTEGER,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CabinGuest" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CabinGuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobAd" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "articleName" TEXT NOT NULL,
    "description" TEXT,
    "companyId" INTEGER NOT NULL,
    "type" "JobType" NOT NULL,
    "location" TEXT,
    "applicationDeadline" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsImage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageSize" "ImageSize" NOT NULL DEFAULT 'MEDIUM',
    "articleSectionId" INTEGER,
    "special" "SpecialCmsImage",

    CONSTRAINT "CmsImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsParagraph" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contentMd" TEXT NOT NULL DEFAULT '',
    "contentHtml" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "articleSectionId" INTEGER,
    "special" "SpecialCmsParagraph",

    CONSTRAINT "CmsParagraph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsLink" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL DEFAULT '/',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL DEFAULT 'Link',
    "special" "SpecialCmsLink",
    "articleSectionId" INTEGER,

    CONSTRAINT "CmsLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleSection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imagePosition" "Position" NOT NULL DEFAULT 'RIGHT',
    "imageSize" INTEGER NOT NULL DEFAULT 200,
    "articleId" INTEGER,
    "order" SERIAL NOT NULL,

    CONSTRAINT "ArticleSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "articleCategoryId" INTEGER,
    "articleCategoryName" TEXT,
    "coverImageId" INTEGER NOT NULL,
    "special" "SpecialCmsArticle",

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ectsPoints" INTEGER NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "cmsParagraphId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseStudyProgram" (
    "courseId" INTEGER NOT NULL,
    "studyProgramId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseStudyProgram_pkey" PRIMARY KEY ("courseId","studyProgramId")
);

-- CreateTable
CREATE TABLE "CourseApprovedAs" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "courseApprovedAsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseApprovedAs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DotWrapper" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "accuserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DotWrapper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dot" (
    "id" SERIAL NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dotWrapperId" INTEGER NOT NULL,

    CONSTRAINT "Dot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DotFreezePeriod" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DotFreezePeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cmsParagraphId" INTEGER NOT NULL,
    "coverImageId" INTEGER NOT NULL,
    "location" TEXT,
    "eventStart" TIMESTAMP(3) NOT NULL,
    "eventEnd" TIMESTAMP(3) NOT NULL,
    "canBeViewdBy" "EventCanView" NOT NULL,
    "hostedByCommiteeId" INTEGER,
    "createdById" INTEGER,
    "takesRegistration" BOOLEAN NOT NULL,
    "places" INTEGER NOT NULL DEFAULT 0,
    "registrationStart" TIMESTAMP(3) NOT NULL,
    "registrationEnd" TIMESTAMP(3) NOT NULL,
    "waitingList" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company" BOOLEAN NOT NULL DEFAULT false,
    "lead" TEXT,
    "extraFields" JSON,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTagEvent" (
    "eventId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "EventTagEvent_pkey" PRIMARY KEY ("eventId","tagId")
);

-- CreateTable
CREATE TABLE "EventTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "colorR" INTEGER NOT NULL,
    "colorG" INTEGER NOT NULL,
    "colorB" INTEGER NOT NULL,
    "special" "SpecialEventTags",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "userId" INTEGER,
    "contactId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "manuallyPaid" BOOLEAN NOT NULL DEFAULT false,
    "company" BOOLEAN NOT NULL DEFAULT false,
    "extraFieldChoices" JSON,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flair" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    "colorR" INTEGER NOT NULL DEFAULT 0,
    "colorG" INTEGER NOT NULL DEFAULT 0,
    "colorB" INTEGER NOT NULL DEFAULT 0,
    "rank" SERIAL NOT NULL,

    CONSTRAINT "Flair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "admin" BOOLEAN NOT NULL,
    "active" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Medlem',
    "order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "groupType" "GroupType" NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "groupId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Committee" (
    "groupId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "committeeArticleId" INTEGER NOT NULL,
    "videoLink" TEXT,
    "logoImageId" INTEGER,
    "paragraphId" INTEGER NOT NULL,
    "applicationParagraphId" INTEGER NOT NULL,

    CONSTRAINT "Committee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterestGroup" (
    "groupId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "articleSectionId" INTEGER NOT NULL,

    CONSTRAINT "InterestGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualGroup" (
    "groupId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,

    CONSTRAINT "ManualGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OmegaMembershipGroup" (
    "groupId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "omegaMembershipLevel" "OmegaMembershipLevel" NOT NULL,

    CONSTRAINT "OmegaMembershipGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyProgramme" (
    "groupId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "insititueCode" TEXT,
    "yearsLength" INTEGER,
    "startYear" INTEGER,
    "partOfOmega" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StudyProgramme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "fsLocationOriginal" TEXT NOT NULL,
    "fsLocationSmallSize" TEXT NOT NULL,
    "fsLocationMediumSize" TEXT NOT NULL,
    "fsLocationLargeSize" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Bilde',
    "extOriginal" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "credit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "licenseName" TEXT,
    "licenseLink" TEXT,
    "standardImage" "StandardImage",

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageCollection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImageId" INTEGER,
    "special" "SpecialCollection",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visibilityAdminId" INTEGER NOT NULL,
    "visibilityRegularId" INTEGER NOT NULL,

    CONSTRAINT "ImageCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locker" (
    "id" SERIAL NOT NULL,
    "building" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LockerLocation" (
    "id" SERIAL NOT NULL,
    "building" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LockerLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LockerReservation" (
    "id" SERIAL NOT NULL,
    "lockerId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "LockerReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailAlias" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "MailAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailAliasMailingList" (
    "mailAliasId" INTEGER NOT NULL,
    "mailingListId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "MailingList" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "MailingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailingListGroup" (
    "mailingListId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "MailingListUser" (
    "mailingListId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "MailAddressExternal" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "MailAddressExternal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailingListMailAddressExternal" (
    "mailingListId" INTEGER NOT NULL,
    "mailAddressExternalId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "articleId" INTEGER NOT NULL,
    "articleName" TEXT NOT NULL,
    "visibilityAdminId" INTEGER NOT NULL,
    "visibilityRegularId" INTEGER NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationChannel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "special" "SpecialNotificationChannel",
    "parentId" INTEGER NOT NULL,
    "defaultMethodsId" INTEGER NOT NULL,
    "availableMethodsId" INTEGER NOT NULL,
    "mailAliasId" INTEGER NOT NULL,

    CONSTRAINT "NotificationChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationMethod" (
    "id" SERIAL NOT NULL,
    "email" BOOLEAN NOT NULL DEFAULT false,
    "emailWeekly" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NotificationMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSubscription" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,
    "methodsId" INTEGER NOT NULL,

    CONSTRAINT "NotificationSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ombul" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "paragraphId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fsLocation" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "issueNumber" INTEGER NOT NULL,
    "coverImageId" INTEGER NOT NULL,

    CONSTRAINT "Ombul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OmegaOrder" (
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OmegaOrder_pkey" PRIMARY KEY ("order")
);

-- CreateTable
CREATE TABLE "OmegaQuote" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userPosterId" INTEGER NOT NULL,

    CONSTRAINT "OmegaQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupPermission" (
    "groupId" INTEGER NOT NULL,
    "permission" "Permission" NOT NULL
);

-- CreateTable
CREATE TABLE "DefaultPermission" (
    "permission" "Permission" NOT NULL
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "standardSchool" "StandardSchool",
    "desctiption" TEXT NOT NULL DEFAULT '',
    "cmsParagraphId" INTEGER NOT NULL,
    "cmsImageId" INTEGER NOT NULL,
    "cmsLinkId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screen" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "orientation" "ScreenOrientation" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Screen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreenPageScreen" (
    "screenPageId" INTEGER NOT NULL,
    "screenId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScreenPageScreen_pkey" PRIMARY KEY ("screenPageId","screenId")
);

-- CreateTable
CREATE TABLE "ScreenPage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ScreenPageType" NOT NULL,
    "jobAdId" INTEGER,
    "cmsImageId" INTEGER NOT NULL,
    "cmsParagraphId" INTEGER NOT NULL,
    "eventId" INTEGER,
    "eventTagId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScreenPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "barcode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopProduct" (
    "shopId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ShopProduct_pkey" PRIMARY KEY ("shopId","productId")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" "PurchaseMethod" NOT NULL,
    "shopId" INTEGER NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseProduct" (
    "purchaseId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "PurchaseProduct_pkey" PRIMARY KEY ("purchaseId","productId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL DEFAULT '[Fjernet]',
    "lastname" TEXT NOT NULL DEFAULT '[Fjernet]',
    "bio" TEXT NOT NULL DEFAULT '',
    "relationshipStatus" "RelationshipStatus" NOT NULL DEFAULT 'NOT_SPECIFIED',
    "relationshipStatusText" TEXT NOT NULL DEFAULT '',
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "acceptedTerms" TIMESTAMP(3),
    "imageConsent" BOOLEAN NOT NULL DEFAULT false,
    "sex" "SEX",
    "allergies" TEXT,
    "mobile" TEXT,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageId" INTEGER,
    "studentCard" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credentials" (
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "credentialsUpdatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "FeideAccount" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FeideAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactDetails" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "mobile" TEXT,

    CONSTRAINT "ContactDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visibility" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisibilityRequirement" (
    "id" SERIAL NOT NULL,
    "visibilityId" INTEGER NOT NULL,

    CONSTRAINT "VisibilityRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisibilityRequirementGroup" (
    "id" SERIAL NOT NULL,
    "visibilityRequirementId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "type" "VisibilityRequirementGroupType" NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "VisibilityRequirementGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_userFlairs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_userFlairs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdmissionTrial_userId_admission_key" ON "AdmissionTrial"("userId", "admission");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_name_key" ON "ApiKey"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHashEncrypted_key" ON "ApiKey"("keyHashEncrypted");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationPeriod_name_key" ON "ApplicationPeriod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CommitteeParticipationInApplicationPeriod_committeeId_appli_key" ON "CommitteeParticipationInApplicationPeriod"("committeeId", "applicationPeriodId");

-- CreateIndex
CREATE UNIQUE INDEX "CommitteeParticipationInApplicationPeriod_id_applicationPer_key" ON "CommitteeParticipationInApplicationPeriod"("id", "applicationPeriodId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_applicationPeriodId_priority_key" ON "Application"("userId", "applicationPeriodId", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_applicationPeriodCommiteeId_key" ON "Application"("userId", "applicationPeriodCommiteeId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_name_key" ON "ArticleCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_id_name_key" ON "ArticleCategory"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "BookingProduct_bookingId_cabinProductId_key" ON "BookingProduct"("bookingId", "cabinProductId");

-- CreateIndex
CREATE UNIQUE INDEX "JobAd_articleId_articleName_key" ON "JobAd"("articleId", "articleName");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_logoId_key" ON "Company"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "CmsImage_name_key" ON "CmsImage"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CmsImage_articleSectionId_key" ON "CmsImage"("articleSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "CmsImage_special_key" ON "CmsImage"("special");

-- CreateIndex
CREATE UNIQUE INDEX "CmsParagraph_name_key" ON "CmsParagraph"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CmsParagraph_articleSectionId_key" ON "CmsParagraph"("articleSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "CmsParagraph_special_key" ON "CmsParagraph"("special");

-- CreateIndex
CREATE UNIQUE INDEX "CmsLink_name_key" ON "CmsLink"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CmsLink_special_key" ON "CmsLink"("special");

-- CreateIndex
CREATE UNIQUE INDEX "CmsLink_articleSectionId_key" ON "CmsLink"("articleSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleSection_name_key" ON "ArticleSection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleSection_articleId_order_key" ON "ArticleSection"("articleId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Article_coverImageId_key" ON "Article"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Article_special_key" ON "Article"("special");

-- CreateIndex
CREATE UNIQUE INDEX "Article_name_id_key" ON "Article"("name", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Article_articleCategoryId_name_key" ON "Article"("articleCategoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_cmsParagraphId_key" ON "Course"("cmsParagraphId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_cmsParagraphId_key" ON "Event"("cmsParagraphId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_coverImageId_key" ON "Event"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTag_name_key" ON "EventTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EventTag_special_key" ON "EventTag"("special");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_userId_key" ON "EventRegistration"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Flair_imageId_key" ON "Flair"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Flair_rank_key" ON "Flair"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_groupId_order_key" ON "Membership"("userId", "groupId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Class_groupId_key" ON "Class"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Class_year_key" ON "Class"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_groupId_key" ON "Committee"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_shortName_key" ON "Committee"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_committeeArticleId_key" ON "Committee"("committeeArticleId");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_logoImageId_key" ON "Committee"("logoImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_paragraphId_key" ON "Committee"("paragraphId");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_applicationParagraphId_key" ON "Committee"("applicationParagraphId");

-- CreateIndex
CREATE UNIQUE INDEX "InterestGroup_groupId_key" ON "InterestGroup"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "InterestGroup_articleSectionId_key" ON "InterestGroup"("articleSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "ManualGroup_groupId_key" ON "ManualGroup"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "ManualGroup_shortName_key" ON "ManualGroup"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "OmegaMembershipGroup_groupId_key" ON "OmegaMembershipGroup"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "OmegaMembershipGroup_omegaMembershipLevel_key" ON "OmegaMembershipGroup"("omegaMembershipLevel");

-- CreateIndex
CREATE UNIQUE INDEX "StudyProgramme_groupId_key" ON "StudyProgramme"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "StudyProgramme_code_key" ON "StudyProgramme"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Image_fsLocationOriginal_key" ON "Image"("fsLocationOriginal");

-- CreateIndex
CREATE UNIQUE INDEX "Image_fsLocationSmallSize_key" ON "Image"("fsLocationSmallSize");

-- CreateIndex
CREATE UNIQUE INDEX "Image_fsLocationMediumSize_key" ON "Image"("fsLocationMediumSize");

-- CreateIndex
CREATE UNIQUE INDEX "Image_fsLocationLargeSize_key" ON "Image"("fsLocationLargeSize");

-- CreateIndex
CREATE UNIQUE INDEX "Image_standardImage_key" ON "Image"("standardImage");

-- CreateIndex
CREATE UNIQUE INDEX "License_name_key" ON "License"("name");

-- CreateIndex
CREATE UNIQUE INDEX "License_name_link_key" ON "License"("name", "link");

-- CreateIndex
CREATE UNIQUE INDEX "ImageCollection_name_key" ON "ImageCollection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ImageCollection_coverImageId_key" ON "ImageCollection"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageCollection_special_key" ON "ImageCollection"("special");

-- CreateIndex
CREATE UNIQUE INDEX "ImageCollection_visibilityAdminId_key" ON "ImageCollection"("visibilityAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageCollection_visibilityRegularId_key" ON "ImageCollection"("visibilityRegularId");

-- CreateIndex
CREATE UNIQUE INDEX "LockerLocation_building_floor_key" ON "LockerLocation"("building", "floor");

-- CreateIndex
CREATE UNIQUE INDEX "LockerReservation_lockerId_key" ON "LockerReservation"("lockerId");

-- CreateIndex
CREATE UNIQUE INDEX "LockerReservation_id_key" ON "LockerReservation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MailAlias_address_key" ON "MailAlias"("address");

-- CreateIndex
CREATE UNIQUE INDEX "MailAliasMailingList_mailAliasId_mailingListId_key" ON "MailAliasMailingList"("mailAliasId", "mailingListId");

-- CreateIndex
CREATE UNIQUE INDEX "MailingList_name_key" ON "MailingList"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MailingListGroup_mailingListId_groupId_key" ON "MailingListGroup"("mailingListId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "MailingListUser_mailingListId_userId_key" ON "MailingListUser"("mailingListId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MailAddressExternal_address_key" ON "MailAddressExternal"("address");

-- CreateIndex
CREATE UNIQUE INDEX "MailingListMailAddressExternal_mailingListId_mailAddressExt_key" ON "MailingListMailAddressExternal"("mailingListId", "mailAddressExternalId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_articleId_key" ON "NewsArticle"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_visibilityAdminId_key" ON "NewsArticle"("visibilityAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_visibilityRegularId_key" ON "NewsArticle"("visibilityRegularId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_articleId_articleName_key" ON "NewsArticle"("articleId", "articleName");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationChannel_name_key" ON "NotificationChannel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationChannel_special_key" ON "NotificationChannel"("special");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSubscription_userId_channelId_key" ON "NotificationSubscription"("userId", "channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Ombul_paragraphId_key" ON "Ombul"("paragraphId");

-- CreateIndex
CREATE UNIQUE INDEX "Ombul_fsLocation_key" ON "Ombul"("fsLocation");

-- CreateIndex
CREATE UNIQUE INDEX "Ombul_coverImageId_key" ON "Ombul"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Ombul_year_name_key" ON "Ombul"("year", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Ombul_year_issueNumber_key" ON "Ombul"("year", "issueNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GroupPermission_groupId_permission_key" ON "GroupPermission"("groupId", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultPermission_permission_key" ON "DefaultPermission"("permission");

-- CreateIndex
CREATE UNIQUE INDEX "School_name_key" ON "School"("name");

-- CreateIndex
CREATE UNIQUE INDEX "School_shortName_key" ON "School"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "School_standardSchool_key" ON "School"("standardSchool");

-- CreateIndex
CREATE UNIQUE INDEX "School_cmsParagraphId_key" ON "School"("cmsParagraphId");

-- CreateIndex
CREATE UNIQUE INDEX "School_cmsImageId_key" ON "School"("cmsImageId");

-- CreateIndex
CREATE UNIQUE INDEX "School_cmsLinkId_key" ON "School"("cmsLinkId");

-- CreateIndex
CREATE UNIQUE INDEX "Screen_name_key" ON "Screen"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ScreenPageScreen_order_screenId_key" ON "ScreenPageScreen"("order", "screenId");

-- CreateIndex
CREATE UNIQUE INDEX "ScreenPage_name_key" ON "ScreenPage"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ScreenPage_cmsImageId_key" ON "ScreenPage"("cmsImageId");

-- CreateIndex
CREATE UNIQUE INDEX "ScreenPage_cmsParagraphId_key" ON "ScreenPage"("cmsParagraphId");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_name_key" ON "Shop"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_imageId_key" ON "User"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentCard_key" ON "User"("studentCard");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_username_email_key" ON "User"("id", "username", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_userId_key" ON "Credentials"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_username_key" ON "Credentials"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_email_key" ON "Credentials"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_userId_username_email_key" ON "Credentials"("userId", "username", "email");

-- CreateIndex
CREATE UNIQUE INDEX "FeideAccount_email_key" ON "FeideAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FeideAccount_userId_key" ON "FeideAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VisibilityRequirementGroup_visibilityRequirementId_groupId__key" ON "VisibilityRequirementGroup"("visibilityRequirementId", "groupId", "order");

-- CreateIndex
CREATE INDEX "_userFlairs_B_index" ON "_userFlairs"("B");

-- AddForeignKey
ALTER TABLE "AdmissionTrial" ADD CONSTRAINT "AdmissionTrial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionTrial" ADD CONSTRAINT "AdmissionTrial_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeParticipationInApplicationPeriod" ADD CONSTRAINT "CommitteeParticipationInApplicationPeriod_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitteeParticipationInApplicationPeriod" ADD CONSTRAINT "CommitteeParticipationInApplicationPeriod_applicationPerio_fkey" FOREIGN KEY ("applicationPeriodId") REFERENCES "ApplicationPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicationPeriodCommiteeId_applicationPeriodI_fkey" FOREIGN KEY ("applicationPeriodCommiteeId", "applicationPeriodId") REFERENCES "CommitteeParticipationInApplicationPeriod"("id", "applicationPeriodId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CabinProductPrice" ADD CONSTRAINT "CabinProductPrice_cabinProductId_fkey" FOREIGN KEY ("cabinProductId") REFERENCES "CabinProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CabinProductPrice" ADD CONSTRAINT "CabinProductPrice_pricePeriodId_fkey" FOREIGN KEY ("pricePeriodId") REFERENCES "PricePeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingProduct" ADD CONSTRAINT "BookingProduct_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingProduct" ADD CONSTRAINT "BookingProduct_cabinProductId_fkey" FOREIGN KEY ("cabinProductId") REFERENCES "CabinProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_guestUserId_fkey" FOREIGN KEY ("guestUserId") REFERENCES "CabinGuest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAd" ADD CONSTRAINT "JobAd_articleId_articleName_fkey" FOREIGN KEY ("articleId", "articleName") REFERENCES "Article"("id", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAd" ADD CONSTRAINT "JobAd_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "CmsImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsImage" ADD CONSTRAINT "CmsImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsImage" ADD CONSTRAINT "CmsImage_articleSectionId_fkey" FOREIGN KEY ("articleSectionId") REFERENCES "ArticleSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsParagraph" ADD CONSTRAINT "CmsParagraph_articleSectionId_fkey" FOREIGN KEY ("articleSectionId") REFERENCES "ArticleSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsLink" ADD CONSTRAINT "CmsLink_articleSectionId_fkey" FOREIGN KEY ("articleSectionId") REFERENCES "ArticleSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleSection" ADD CONSTRAINT "ArticleSection_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_articleCategoryId_articleCategoryName_fkey" FOREIGN KEY ("articleCategoryId", "articleCategoryName") REFERENCES "ArticleCategory"("id", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "CmsImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_cmsParagraphId_fkey" FOREIGN KEY ("cmsParagraphId") REFERENCES "CmsParagraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseStudyProgram" ADD CONSTRAINT "CourseStudyProgram_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseStudyProgram" ADD CONSTRAINT "CourseStudyProgram_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "StudyProgramme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseApprovedAs" ADD CONSTRAINT "CourseApprovedAs_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseApprovedAs" ADD CONSTRAINT "CourseApprovedAs_courseApprovedAsId_fkey" FOREIGN KEY ("courseApprovedAsId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DotWrapper" ADD CONSTRAINT "DotWrapper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DotWrapper" ADD CONSTRAINT "DotWrapper_accuserId_fkey" FOREIGN KEY ("accuserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dot" ADD CONSTRAINT "Dot_dotWrapperId_fkey" FOREIGN KEY ("dotWrapperId") REFERENCES "DotWrapper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_cmsParagraphId_fkey" FOREIGN KEY ("cmsParagraphId") REFERENCES "CmsParagraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "CmsImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostedByCommiteeId_fkey" FOREIGN KEY ("hostedByCommiteeId") REFERENCES "Committee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTagEvent" ADD CONSTRAINT "EventTagEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTagEvent" ADD CONSTRAINT "EventTagEvent_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "EventTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "ContactDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flair" ADD CONSTRAINT "Flair_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_order_fkey" FOREIGN KEY ("order") REFERENCES "OmegaOrder"("order") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_order_fkey" FOREIGN KEY ("order") REFERENCES "OmegaOrder"("order") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_committeeArticleId_fkey" FOREIGN KEY ("committeeArticleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_logoImageId_fkey" FOREIGN KEY ("logoImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_paragraphId_fkey" FOREIGN KEY ("paragraphId") REFERENCES "CmsParagraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_applicationParagraphId_fkey" FOREIGN KEY ("applicationParagraphId") REFERENCES "CmsParagraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestGroup" ADD CONSTRAINT "InterestGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestGroup" ADD CONSTRAINT "InterestGroup_articleSectionId_fkey" FOREIGN KEY ("articleSectionId") REFERENCES "ArticleSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualGroup" ADD CONSTRAINT "ManualGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OmegaMembershipGroup" ADD CONSTRAINT "OmegaMembershipGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyProgramme" ADD CONSTRAINT "StudyProgramme_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "ImageCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_licenseName_licenseLink_fkey" FOREIGN KEY ("licenseName", "licenseLink") REFERENCES "License"("name", "link") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCollection" ADD CONSTRAINT "ImageCollection_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCollection" ADD CONSTRAINT "ImageCollection_visibilityAdminId_fkey" FOREIGN KEY ("visibilityAdminId") REFERENCES "Visibility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCollection" ADD CONSTRAINT "ImageCollection_visibilityRegularId_fkey" FOREIGN KEY ("visibilityRegularId") REFERENCES "Visibility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locker" ADD CONSTRAINT "Locker_building_floor_fkey" FOREIGN KEY ("building", "floor") REFERENCES "LockerLocation"("building", "floor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockerReservation" ADD CONSTRAINT "LockerReservation_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "Locker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockerReservation" ADD CONSTRAINT "LockerReservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LockerReservation" ADD CONSTRAINT "LockerReservation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailAliasMailingList" ADD CONSTRAINT "MailAliasMailingList_mailAliasId_fkey" FOREIGN KEY ("mailAliasId") REFERENCES "MailAlias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailAliasMailingList" ADD CONSTRAINT "MailAliasMailingList_mailingListId_fkey" FOREIGN KEY ("mailingListId") REFERENCES "MailingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingListGroup" ADD CONSTRAINT "MailingListGroup_mailingListId_fkey" FOREIGN KEY ("mailingListId") REFERENCES "MailingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingListGroup" ADD CONSTRAINT "MailingListGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingListUser" ADD CONSTRAINT "MailingListUser_mailingListId_fkey" FOREIGN KEY ("mailingListId") REFERENCES "MailingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingListUser" ADD CONSTRAINT "MailingListUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingListMailAddressExternal" ADD CONSTRAINT "MailingListMailAddressExternal_mailingListId_fkey" FOREIGN KEY ("mailingListId") REFERENCES "MailingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingListMailAddressExternal" ADD CONSTRAINT "MailingListMailAddressExternal_mailAddressExternalId_fkey" FOREIGN KEY ("mailAddressExternalId") REFERENCES "MailAddressExternal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_articleId_articleName_fkey" FOREIGN KEY ("articleId", "articleName") REFERENCES "Article"("id", "name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_visibilityAdminId_fkey" FOREIGN KEY ("visibilityAdminId") REFERENCES "Visibility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_visibilityRegularId_fkey" FOREIGN KEY ("visibilityRegularId") REFERENCES "Visibility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationChannel" ADD CONSTRAINT "NotificationChannel_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NotificationChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationChannel" ADD CONSTRAINT "NotificationChannel_defaultMethodsId_fkey" FOREIGN KEY ("defaultMethodsId") REFERENCES "NotificationMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationChannel" ADD CONSTRAINT "NotificationChannel_availableMethodsId_fkey" FOREIGN KEY ("availableMethodsId") REFERENCES "NotificationMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationChannel" ADD CONSTRAINT "NotificationChannel_mailAliasId_fkey" FOREIGN KEY ("mailAliasId") REFERENCES "MailAlias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSubscription" ADD CONSTRAINT "NotificationSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSubscription" ADD CONSTRAINT "NotificationSubscription_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "NotificationChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSubscription" ADD CONSTRAINT "NotificationSubscription_methodsId_fkey" FOREIGN KEY ("methodsId") REFERENCES "NotificationMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "NotificationChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ombul" ADD CONSTRAINT "Ombul_paragraphId_fkey" FOREIGN KEY ("paragraphId") REFERENCES "CmsParagraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ombul" ADD CONSTRAINT "Ombul_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OmegaQuote" ADD CONSTRAINT "OmegaQuote_userPosterId_fkey" FOREIGN KEY ("userPosterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupPermission" ADD CONSTRAINT "GroupPermission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_cmsParagraphId_fkey" FOREIGN KEY ("cmsParagraphId") REFERENCES "CmsParagraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_cmsImageId_fkey" FOREIGN KEY ("cmsImageId") REFERENCES "CmsImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_cmsLinkId_fkey" FOREIGN KEY ("cmsLinkId") REFERENCES "CmsLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenPageScreen" ADD CONSTRAINT "ScreenPageScreen_screenPageId_fkey" FOREIGN KEY ("screenPageId") REFERENCES "ScreenPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenPageScreen" ADD CONSTRAINT "ScreenPageScreen_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenPage" ADD CONSTRAINT "ScreenPage_jobAdId_fkey" FOREIGN KEY ("jobAdId") REFERENCES "JobAd"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenPage" ADD CONSTRAINT "ScreenPage_cmsImageId_fkey" FOREIGN KEY ("cmsImageId") REFERENCES "CmsImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenPage" ADD CONSTRAINT "ScreenPage_cmsParagraphId_fkey" FOREIGN KEY ("cmsParagraphId") REFERENCES "CmsParagraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenPage" ADD CONSTRAINT "ScreenPage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenPage" ADD CONSTRAINT "ScreenPage_eventTagId_fkey" FOREIGN KEY ("eventTagId") REFERENCES "EventTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopProduct" ADD CONSTRAINT "ShopProduct_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopProduct" ADD CONSTRAINT "ShopProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseProduct" ADD CONSTRAINT "PurchaseProduct_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseProduct" ADD CONSTRAINT "PurchaseProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credentials" ADD CONSTRAINT "Credentials_userId_username_email_fkey" FOREIGN KEY ("userId", "username", "email") REFERENCES "User"("id", "username", "email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeideAccount" ADD CONSTRAINT "FeideAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisibilityRequirement" ADD CONSTRAINT "VisibilityRequirement_visibilityId_fkey" FOREIGN KEY ("visibilityId") REFERENCES "Visibility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisibilityRequirementGroup" ADD CONSTRAINT "VisibilityRequirementGroup_visibilityRequirementId_fkey" FOREIGN KEY ("visibilityRequirementId") REFERENCES "VisibilityRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisibilityRequirementGroup" ADD CONSTRAINT "VisibilityRequirementGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisibilityRequirementGroup" ADD CONSTRAINT "VisibilityRequirementGroup_order_fkey" FOREIGN KEY ("order") REFERENCES "OmegaOrder"("order") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userFlairs" ADD CONSTRAINT "_userFlairs_A_fkey" FOREIGN KEY ("A") REFERENCES "Flair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userFlairs" ADD CONSTRAINT "_userFlairs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

