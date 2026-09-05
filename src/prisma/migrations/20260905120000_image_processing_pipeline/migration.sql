-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('RASTER', 'SVG');

-- DropForeignKey
ALTER TABLE "Ombul" DROP CONSTRAINT "Ombul_coverImageId_fkey";

-- DropIndex
DROP INDEX "Image_fsLocationSmallSize_key";

-- DropIndex
DROP INDEX "Image_fsLocationMediumSize_key";

-- DropIndex
DROP INDEX "Image_fsLocationLargeSize_key";

-- AlterTable
-- CmsImage.imageSize (small/medium/large display choice) has no successor column -
-- rendering now picks a size responsively (see src/lib/images/resolutionForWidth.ts)
-- instead of a per-image stored preference. Already unreadable by the deployed
-- Prisma Client, which was generated from a schema that no longer has this field.
ALTER TABLE "CmsImage" DROP COLUMN "imageSize";

-- AlterTable
-- `type` is added nullable first, backfilled below, then locked to NOT NULL - a
-- literal `ADD COLUMN ... NOT NULL` here would fail outright against the existing
-- Image rows, and there is no single default: SVG support is new, but a handful of
-- pre-existing rows could in principle already carry a .svg original.
ALTER TABLE "Image" DROP COLUMN "fsLocationLargeSize",
DROP COLUMN "fsLocationMediumSize",
DROP COLUMN "fsLocationSmallSize",
ADD COLUMN     "placeholderDataUrl" TEXT,
ADD COLUMN     "processingAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "processingError" TEXT,
ADD COLUMN     "processingStartedAt" TIMESTAMP(3),
ADD COLUMN     "type" "ImageType";

-- Backfill `type` using the exact same rule upload assigns it by (see
-- imageOperations.uploadImage in src/services/images/subservice/operations.ts):
-- extension `svg` -> SVG, everything else -> RASTER.
UPDATE "Image" SET "type" = CASE
    WHEN lower("extOriginal") = 'svg' THEN 'SVG'::"ImageType"
    ELSE 'RASTER'::"ImageType"
END;

ALTER TABLE "Image" ALTER COLUMN "type" SET NOT NULL;

-- DropEnum
DROP TYPE "ImageSize";

-- CreateTable
-- Left empty on purpose. The old fsLocation{Small,Medium,Large}Size columns are
-- dropped above rather than copied forward: every pre-existing Image is RASTER (SVG
-- support is new), and the background worker (src/services/images/subservice/worker.ts)
-- already claims and (re)processes any RASTER Image with no ProcessedImageFiles row and
-- no in-progress/exhausted processing attempt, regenerating tiny/small/medium/large avif
-- variants straight from fsLocationOriginal - which this migration never touches. Leaving
-- every existing Image without a ProcessedImageFiles row here is exactly what makes the
-- worker pick all of them up automatically once this deploy is live.
CREATE TABLE "ProcessedImageFiles" (
    "id" SERIAL NOT NULL,
    "imageId" INTEGER NOT NULL,
    "fsLocationTinySize" TEXT NOT NULL,
    "fsLocationSmallSize" TEXT NOT NULL,
    "fsLocationMediumSize" TEXT NOT NULL,
    "fsLocationLargeSize" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedImageFiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedImageFiles_imageId_key" ON "ProcessedImageFiles"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedImageFiles_fsLocationTinySize_key" ON "ProcessedImageFiles"("fsLocationTinySize");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedImageFiles_fsLocationSmallSize_key" ON "ProcessedImageFiles"("fsLocationSmallSize");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedImageFiles_fsLocationMediumSize_key" ON "ProcessedImageFiles"("fsLocationMediumSize");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedImageFiles_fsLocationLargeSize_key" ON "ProcessedImageFiles"("fsLocationLargeSize");

-- AddForeignKey
ALTER TABLE "ProcessedImageFiles" ADD CONSTRAINT "ProcessedImageFiles_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ombul" ADD CONSTRAINT "Ombul_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
