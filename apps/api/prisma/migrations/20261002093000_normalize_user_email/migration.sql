-- Les emails sont désormais normalisés en minuscules à l'entrée de l'API
-- (apps/api/src/shared/http/schemas.js). On aligne les données existantes.

-- Deux comptes ne différant que par la casse ne peuvent pas être fusionnés
-- automatiquement : il faut choisir lequel garder. On échoue en les nommant.
DO $$
DECLARE doublons text;
BEGIN
  SELECT string_agg(e, ', ') INTO doublons
  FROM (SELECT lower(email) AS e FROM "User" GROUP BY lower(email) HAVING count(*) > 1) d;

  IF doublons IS NOT NULL THEN
    RAISE EXCEPTION 'Comptes en double à fusionner avant cette migration : %', doublons;
  END IF;
END $$;

UPDATE "User" SET email = lower(email) WHERE email <> lower(email);
