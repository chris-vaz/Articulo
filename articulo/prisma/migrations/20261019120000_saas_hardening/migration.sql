-- DropForeignKey
ALTER TABLE "Connections" DROP CONSTRAINT "Connections_discordWebhookId_fkey";

-- DropForeignKey
ALTER TABLE "Connections" DROP CONSTRAINT "Connections_notionId_fkey";

-- DropForeignKey
ALTER TABLE "Connections" DROP CONSTRAINT "Connections_slackId_fkey";

-- DropForeignKey
ALTER TABLE "Connections" DROP CONSTRAINT "Connections_userId_fkey";

-- DropForeignKey
ALTER TABLE "DiscordWebhook" DROP CONSTRAINT "DiscordWebhook_userId_fkey";

-- DropForeignKey
ALTER TABLE "LocalGoogleCredential" DROP CONSTRAINT "LocalGoogleCredential_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notion" DROP CONSTRAINT "Notion_userId_fkey";

-- DropForeignKey
ALTER TABLE "Slack" DROP CONSTRAINT "Slack_userId_fkey";

-- DropForeignKey
ALTER TABLE "Workflows" DROP CONSTRAINT "Workflows_userId_fkey";

-- DropIndex
DROP INDEX "Connections_type_key";

-- DropIndex
DROP INDEX "DiscordWebhook_channelId_key";

-- DropIndex
DROP INDEX "Notion_accessToken_key";

-- DropIndex
DROP INDEX "Notion_databaseId_key";

-- DropIndex
DROP INDEX "Notion_workspaceId_key";

-- DropIndex
DROP INDEX "Slack_authedUserToken_key";

-- DropIndex
DROP INDEX "Slack_slackAccessToken_key";

-- AlterTable (keeps existing users' plans and credits; 'Unlimited' becomes -1)
UPDATE "User" SET "tier" = 'Free' WHERE "tier" IS NULL;
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ALTER COLUMN "tier" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "credits" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "credits" TYPE INTEGER USING (
  CASE
    WHEN "credits" ~ '^[0-9]+$' THEN "credits"::INTEGER
    WHEN "credits" = 'Unlimited' THEN -1
    ELSE 10
  END
);
UPDATE "User" SET "credits" = 10 WHERE "credits" IS NULL;
ALTER TABLE "User" ALTER COLUMN "credits" SET NOT NULL,
ALTER COLUMN "credits" SET DEFAULT 10;

-- CreateTable
CREATE TABLE IF NOT EXISTS "WorkflowExecution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "logs" TEXT,

    CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WorkflowExecution_workflowId_createdAt_idx" ON "WorkflowExecution"("workflowId", "createdAt");

-- CreateIndex
CREATE INDEX "Connections_userId_type_idx" ON "Connections"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordWebhook_userId_channelId_key" ON "DiscordWebhook"("userId", "channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Notion_userId_workspaceId_key" ON "Notion"("userId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Slack_userId_teamId_key" ON "Slack"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Workflows_userId_idx" ON "Workflows"("userId");

-- AddForeignKey
ALTER TABLE "LocalGoogleCredential" ADD CONSTRAINT "LocalGoogleCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordWebhook" ADD CONSTRAINT "DiscordWebhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slack" ADD CONSTRAINT "Slack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notion" ADD CONSTRAINT "Notion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_discordWebhookId_fkey" FOREIGN KEY ("discordWebhookId") REFERENCES "DiscordWebhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_notionId_fkey" FOREIGN KEY ("notionId") REFERENCES "Notion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_slackId_fkey" FOREIGN KEY ("slackId") REFERENCES "Slack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connections" ADD CONSTRAINT "Connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflows" ADD CONSTRAINT "Workflows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowExecution" DROP CONSTRAINT IF EXISTS "WorkflowExecution_workflowId_fkey";
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

