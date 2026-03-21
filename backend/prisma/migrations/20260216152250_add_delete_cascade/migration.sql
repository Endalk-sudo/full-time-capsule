-- DropForeignKey
ALTER TABLE "Capsule" DROP CONSTRAINT "Capsule_user_id_fkey";

-- DropForeignKey
ALTER TABLE "CapsuleFile" DROP CONSTRAINT "CapsuleFile_capsule_id_fkey";

-- DropForeignKey
ALTER TABLE "Recipient" DROP CONSTRAINT "Recipient_capsule_id_fkey";

-- AddForeignKey
ALTER TABLE "Capsule" ADD CONSTRAINT "Capsule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapsuleFile" ADD CONSTRAINT "CapsuleFile_capsule_id_fkey" FOREIGN KEY ("capsule_id") REFERENCES "Capsule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipient" ADD CONSTRAINT "Recipient_capsule_id_fkey" FOREIGN KEY ("capsule_id") REFERENCES "Capsule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
