import { faker } from '@faker-js/faker/locale/fr';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/shared/db/prisma.js';
import { CATALOGUE, GABARITS } from './seed/catalogue.js';

faker.seed(20261002);

const NB_UTILISATEURS = 24;
const PROJETS_PAR_UTILISATEUR = [0, 1, 1, 2, 2, 3, 3, 4, 5, 7];
const COMPTE_DEMO = 'demo@carbontrack.fr';
const TYPES = ['NEUF', 'RENOVATION', 'EXTENSION', 'AMENAGEMENT'];
const STATUTS = ['DRAFT', 'IN_PROGRESS', 'DONE'];
const METIERS = [
  'Architecte',
  'Maître d’œuvre',
  'Conducteur de travaux',
  'Économiste de la construction',
  'Bureau d’études thermiques',
  'Artisan maçon',
  'Charpentier',
  'Promoteur',
];
const MOT_DE_PASSE_DEMO = 'Motdepasse1!';

const auHasardEntre = (min, max) => {
  const valeur = faker.number.float({ min, max, fractionDigits: 2 });
  return max - min > 50 ? Math.round(valeur) : valeur;
};

const dateRecente = () => {
  const moisEnArriere = Math.floor(Math.abs(faker.number.float({ min: 0, max: 1 }) ** 1.6 * 12));
  const date = new Date();
  date.setMonth(date.getMonth() - moisEnArriere);
  date.setDate(faker.number.int({ min: 1, max: 28 }));
  date.setHours(faker.number.int({ min: 8, max: 19 }), faker.number.int({ min: 0, max: 59 }));
  return date;
};

async function vider() {
  await prisma.projectMaterial.deleteMany();
  await prisma.project.deleteMany();
  await prisma.material.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany({ where: { email: { endsWith: '@carbontrack.test' } } });
  await prisma.user.deleteMany({ where: { email: COMPTE_DEMO } });
  console.log('Tables vidées (les comptes réels sont conservés).');
}

async function semerCatalogue() {
  const materiauxParNom = new Map();

  for (const { categorie, materiaux } of CATALOGUE) {
    const existante = await prisma.category.findFirst({ where: { name: categorie } });
    const { id: categoryId } =
      existante ?? (await prisma.category.create({ data: { name: categorie } }));

    for (const [name, supplier, carbonFootprint, unit, pricePerUnit] of materiaux) {
      const deja = await prisma.material.findFirst({ where: { name, categoryId } });
      materiauxParNom.set(
        name,
        deja ??
          (await prisma.material.create({
            data: { name, supplier, carbonFootprint, unit, pricePerUnit, categoryId },
          })),
      );
    }
  }

  return materiauxParNom;
}

async function semerUtilisateurs() {
  const motDePasse = await bcrypt.hash(MOT_DE_PASSE_DEMO, 10);

  const demo = await prisma.user.upsert({
    where: { email: COMPTE_DEMO },
    update: { role: 'ADMIN' },
    create: {
      email: COMPTE_DEMO,
      name: 'Compte de démonstration',
      role: 'ADMIN',
      password: motDePasse,
      company: 'CarbonTrack',
      jobTitle: 'Administrateur',
      city: 'Nantes',
      createdAt: new Date(new Date().setMonth(new Date().getMonth() - 11)),
    },
  });

  const utilisateurs = [demo];

  for (let i = 0; i < NB_UTILISATEURS; i += 1) {
    const prenom = faker.person.firstName();
    const nom = faker.person.lastName();
    const email = `${prenom}.${nom}${i}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9.]/g, '');

    utilisateurs.push(
      await prisma.user.upsert({
        where: { email: `${email}@carbontrack.test` },
        update: {},
        create: {
          email: `${email}@carbontrack.test`,
          name: `${prenom} ${nom}`,
          role: 'USER',
          password: motDePasse,
          createdAt: dateRecente(),
          googleId: faker.number.int({ min: 1, max: 5 }) === 1 ? faker.string.numeric(21) : null,
          company: faker.company.name(),
          jobTitle: faker.helpers.arrayElement(METIERS),
          phone: faker.phone.number({ style: 'national' }),
          city: faker.location.city(),
        },
      }),
    );
  }

  return utilisateurs;
}

async function semerProjets(utilisateurs, materiauxParNom) {
  let crees = 0;

  for (const utilisateur of utilisateurs) {
    const nbProjets = faker.helpers.arrayElement(PROJETS_PAR_UTILISATEUR);

    for (let i = 0; i < nbProjets; i += 1) {
      const gabarit = faker.helpers.arrayElement(GABARITS);
      const ville = faker.location.city();
      const name = `${gabarit.nom} — ${ville}`;

      if (await prisma.project.findFirst({ where: { name, userId: utilisateur.id } })) continue;

      const lignes = [];
      const vus = new Set();
      for (const [nom, min, max] of gabarit.lignes) {
        const materiau = materiauxParNom.get(nom);
        if (!materiau || vus.has(materiau.id)) continue;
        vus.add(materiau.id);
        lignes.push({ materialId: materiau.id, quantity: auHasardEntre(min, max), materiau });
      }

      const totalFootprint = lignes.reduce(
        (total, l) => total + Number(l.materiau.carbonFootprint) * l.quantity,
        0,
      );

      await prisma.project.create({
        data: {
          name,
          description: gabarit.description,
          totalFootprint: Math.round(totalFootprint * 100) / 100,
          userId: utilisateur.id,
          createdAt: dateRecente(),
          location: ville,
          surface: faker.number.float({ min: 18, max: 900, fractionDigits: 1 }),
          kind: faker.helpers.arrayElement(TYPES),
          status: faker.helpers.arrayElement(STATUTS),
          startDate: dateRecente(),
          ProjectMaterial: {
            create: lignes.map(({ materialId, quantity }) => ({ materialId, quantity })),
          },
        },
      });
      crees += 1;
    }
  }

  return crees;
}

async function main() {
  if (process.argv.includes('--reset')) await vider();

  const materiauxParNom = await semerCatalogue();
  const utilisateurs = await semerUtilisateurs();
  const projetsCrees = await semerProjets(utilisateurs, materiauxParNom);

  const [categories, materiaux, projets, lignes, comptes] = await Promise.all([
    prisma.category.count(),
    prisma.material.count(),
    prisma.project.count(),
    prisma.projectMaterial.count(),
    prisma.user.count(),
  ]);

  console.log(
    `\nBase remplie :\n` +
      `  ${categories} catégories\n` +
      `  ${materiaux} matériaux\n` +
      `  ${comptes} comptes\n` +
      `  ${projets} projets (${projetsCrees} créés à l'instant), ${lignes} lignes\n`,
  );
  console.log(`Compte de démonstration : ${COMPTE_DEMO} / ${MOT_DE_PASSE_DEMO} (administrateur)`);
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
