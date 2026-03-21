import dotenv from "dotenv";
dotenv.config();
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";
import app from "./app.js";
import checkDb from "./jobs/checkCapsule.job.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 8000;

app.listen(PORT, (err) => {
  if (err) {
    console.log("error", err.message);
    process.exit(1);
  }
  console.log(`server is runnign on port ${PORT}`);
});

// checkDb();

export default prisma;
