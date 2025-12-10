/*
  Warnings:

  - You are about to drop the column `school` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `tool` on the `Review` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - Added the required column `schoolId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toolId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "school",
DROP COLUMN "tool",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "schoolId" INTEGER NOT NULL,
ADD COLUMN     "toolId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userEmail" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE SMALLINT,
ALTER COLUMN "review" DROP NOT NULL;

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "logo_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolTool" (
    "schoolId" INTEGER NOT NULL,
    "toolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolTool_pkey" PRIMARY KEY ("schoolId","toolId")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_domain_key" ON "School"("domain");

-- AddForeignKey
ALTER TABLE "SchoolTool" ADD CONSTRAINT "SchoolTool_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolTool" ADD CONSTRAINT "SchoolTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
