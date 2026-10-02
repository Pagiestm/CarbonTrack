import { Footprint } from '@/domain/entities/Footprint.js';
import { PROJECT_KINDS, PROJECT_STATUSES } from '@/domain/entities/Project.js';
import { ACCENT, ACCENT_SOFT, SERIE } from '@/presentation/components/ui/chart-theme.js';

const MOIS = () => {
  const annee = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, i) =>
    new Date(annee, i).toLocaleString('fr-FR', { month: 'short' }),
  );
};

export const parMois = (dates) => {
  const annee = new Date().getFullYear();
  const compteurs = Array(12).fill(0);
  for (const iso of dates) {
    const date = new Date(iso);
    if (date.getFullYear() === annee) compteurs[date.getMonth()] += 1;
  }
  return compteurs;
};

export const serieMensuelle = (dates, label) => ({
  labels: MOIS(),
  datasets: [
    {
      label,
      data: parMois(dates),
      backgroundColor: ACCENT_SOFT,
      borderColor: ACCENT,
      borderWidth: 2,
      borderRadius: 6,
      tension: 0.35,
      fill: true,
      pointRadius: 2,
    },
  ],
});

export const serieActiviteMensuelle = (projets, utilisateurs) => ({
  labels: MOIS(),
  datasets: [
    {
      label: 'Projets créés',
      data: parMois(projets.map((p) => p.createdAt)),
      backgroundColor: ACCENT,
      borderRadius: 4,
    },
    {
      label: 'Comptes ouverts',
      data: parMois(utilisateurs.map((u) => u.createdAt)),
      backgroundColor: SERIE[1],
      borderRadius: 4,
    },
  ],
});

export const empreinteMensuelle = (projets) => {
  const annee = new Date().getFullYear();
  const totaux = Array(12).fill(0);
  for (const projet of projets) {
    const date = new Date(projet.createdAt);
    if (date.getFullYear() === annee) totaux[date.getMonth()] += projet.totalFootprint.tonnes;
  }
  return {
    labels: MOIS(),
    datasets: [
      {
        label: 'Empreinte (t eq. CO₂)',
        data: totaux.map((t) => Math.round(t * 100) / 100),
        backgroundColor: ACCENT_SOFT,
        borderColor: ACCENT,
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };
};

export const parNiveau = (projets) => {
  const niveaux = { faible: 0, modere: 0, eleve: 0 };
  for (const projet of projets) niveaux[projet.totalFootprint.niveau] += 1;
  return {
    labels: ['Sobre', 'Modéré', 'Élevé'],
    datasets: [
      {
        data: [niveaux.faible, niveaux.modere, niveaux.eleve],
        backgroundColor: ['#15803d', '#b45309', '#b91c1c'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };
};

const repartition = (valeurs, libelles) => ({
  labels: Object.values(libelles),
  datasets: [
    {
      data: Object.keys(libelles).map((cle) => valeurs[cle] ?? 0),
      backgroundColor: SERIE,
      borderColor: '#ffffff',
      borderWidth: 2,
    },
  ],
});

export const parType = (projets) =>
  repartition(
    projets.reduce((acc, p) => ({ ...acc, [p.kind]: (acc[p.kind] ?? 0) + 1 }), {}),
    PROJECT_KINDS,
  );

export const parStatut = (projets) =>
  repartition(
    projets.reduce((acc, p) => ({ ...acc, [p.status]: (acc[p.status] ?? 0) + 1 }), {}),
    PROJECT_STATUSES,
  );

export const materiauxLesPlusLourds = (materiaux, combien = 8) => {
  const tries = [...materiaux]
    .sort((a, b) => b.carbonFootprint - a.carbonFootprint)
    .slice(0, combien);
  return {
    labels: tries.map((m) => m.name),
    datasets: [
      {
        label: 'kg eq. CO₂ par unité',
        data: tries.map((m) => m.carbonFootprint),
        backgroundColor: SERIE[0],
        borderRadius: 4,
      },
    ],
  };
};

export const materiauxParCategorie = (materiaux, categories) => {
  const compteurs = new Map(categories.map((c) => [c.id, 0]));
  for (const materiau of materiaux) {
    compteurs.set(materiau.categoryId, (compteurs.get(materiau.categoryId) ?? 0) + 1);
  }
  const lignes = categories
    .map((categorie) => ({ nom: categorie.name, nombre: compteurs.get(categorie.id) ?? 0 }))
    .filter((l) => l.nombre)
    .sort((a, b) => b.nombre - a.nombre);

  return {
    labels: lignes.map((l) => l.nom),
    datasets: [
      {
        data: lignes.map((l) => l.nombre),
        backgroundColor: SERIE,
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };
};

export const projetsLesPlusLourds = (projets, combien = 10) => {
  const tries = [...projets]
    .sort((a, b) => b.totalFootprint.kg - a.totalFootprint.kg)
    .slice(0, combien);
  return {
    labels: tries.map((p) => p.name),
    datasets: [
      {
        label: 't eq. CO₂',
        data: tries.map((p) => Math.round(p.totalFootprint.tonnes * 100) / 100),
        backgroundColor: tries.map(
          (p) =>
            ({ faible: '#15803d', modere: '#b45309', eleve: '#b91c1c' })[p.totalFootprint.niveau],
        ),
        borderRadius: 4,
      },
    ],
  };
};

export const empreinteMoyenne = (projets) =>
  projets.length
    ? new Footprint(projets.reduce((s, p) => s + p.totalFootprint.kg, 0) / projets.length)
    : new Footprint(0);

export const empreinteMediane = (projets) => {
  if (!projets.length) return new Footprint(0);
  const valeurs = projets.map((p) => p.totalFootprint.kg).sort((a, b) => a - b);
  const milieu = Math.floor(valeurs.length / 2);
  return new Footprint(
    valeurs.length % 2 ? valeurs[milieu] : (valeurs[milieu - 1] + valeurs[milieu]) / 2,
  );
};
