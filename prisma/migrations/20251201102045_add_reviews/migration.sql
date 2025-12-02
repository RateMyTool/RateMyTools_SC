-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "school" TEXT NOT NULL,
    "tool" TEXT NOT NULL,
    "subject" TEXT,
    "courseNumber" TEXT,
    "rating" INTEGER NOT NULL,
    "tags" TEXT[],
    "review" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
