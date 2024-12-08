-- CreateTable
CREATE TABLE "calls" (
    "id" SERIAL NOT NULL,
    "remote_call_id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "started_at" TIMESTAMP NOT NULL,
    "ended_at" TIMESTAMP,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calls_remote_call_id_key" ON "calls"("remote_call_id");
