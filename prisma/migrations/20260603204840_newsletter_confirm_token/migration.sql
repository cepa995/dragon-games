-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN "confirmToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_confirmToken_key" ON "NewsletterSubscriber"("confirmToken");
