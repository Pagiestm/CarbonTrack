-- Contexte du chantier sur un projet, et informations de profil sur un compte.
-- Tout est facultatif : les lignes existantes restent valides.

ALTER TABLE "Project"
  ADD COLUMN "location"  VARCHAR(100),
  ADD COLUMN "surface"   DOUBLE PRECISION,
  ADD COLUMN "kind"      VARCHAR(20) NOT NULL DEFAULT 'NEUF',
  ADD COLUMN "status"    VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "startDate" TIMESTAMP(3);

ALTER TABLE "User"
  ADD COLUMN "company"  VARCHAR(100),
  ADD COLUMN "jobTitle" VARCHAR(80),
  ADD COLUMN "phone"    VARCHAR(30),
  ADD COLUMN "city"     VARCHAR(100);
