-- CreateEnum
CREATE TYPE "CapsuleStatus" AS ENUM ('LOCKED', 'SENT', 'PROCESSING');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capsule" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message_body" TEXT NOT NULL,
    "unlock_date" TIMESTAMP(3) NOT NULL,
    "status" "CapsuleStatus" NOT NULL DEFAULT 'LOCKED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Capsule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapsuleFile" (
    "id" UUID NOT NULL,
    "capsule_id" UUID NOT NULL,
    "s3_object_key" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,

    CONSTRAINT "CapsuleFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipient" (
    "id" UUID NOT NULL,
    "capsule_id" UUID NOT NULL,
    "email_address" TEXT NOT NULL,
    "delivery_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Recipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Capsule" ADD CONSTRAINT "Capsule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapsuleFile" ADD CONSTRAINT "CapsuleFile_capsule_id_fkey" FOREIGN KEY ("capsule_id") REFERENCES "Capsule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipient" ADD CONSTRAINT "Recipient_capsule_id_fkey" FOREIGN KEY ("capsule_id") REFERENCES "Capsule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
