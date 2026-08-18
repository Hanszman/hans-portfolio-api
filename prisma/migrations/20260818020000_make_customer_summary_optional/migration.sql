-- Make Customer.summary(Pt/En/Es) optional.

ALTER TABLE "customer"
  ALTER COLUMN "summaryPt" DROP NOT NULL,
  ALTER COLUMN "summaryEn" DROP NOT NULL,
  ALTER COLUMN "summaryEs" DROP NOT NULL;
