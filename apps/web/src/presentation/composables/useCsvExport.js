const BOM = '﻿';

const echappe = (valeur) => {
  const texte = String(valeur ?? '');
  return /[";\n]/.test(texte) ? `"${texte.replace(/"/g, '""')}"` : texte;
};

const nombre = (valeur) => String(valeur ?? '').replace('.', ',');

export const projetEnCsv = (projet) => {
  const entete = [
    'Matériau',
    'Catégorie',
    'Fournisseur',
    'Quantité',
    'Unité',
    'Empreinte (kg eq. CO2)',
    'Coût (EUR)',
  ];

  const lignes = projet.lines.map((ligne) => [
    ligne.material?.name ?? 'Matériau supprimé',
    ligne.material?.category?.name ?? '',
    ligne.material?.supplier ?? '',
    nombre(ligne.quantity),
    ligne.material?.unit ?? '',
    nombre(ligne.footprint.kg),
    nombre(Math.round(ligne.cost * 100) / 100),
  ]);

  const total = [
    'Total',
    '',
    '',
    '',
    '',
    nombre(projet.totalFootprint.kg),
    nombre(Math.round(projet.cost * 100) / 100),
  ];

  return [entete, ...lignes, total].map((ligne) => ligne.map(echappe).join(';')).join('\r\n');
};

export const telechargerCsv = (contenu, nomFichier) => {
  const blob = new Blob([BOM + contenu], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = nomFichier;
  lien.click();
  URL.revokeObjectURL(url);
};
