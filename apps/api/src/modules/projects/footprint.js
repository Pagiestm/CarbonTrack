// Empreinte carbone d'un projet : somme des (empreinte unitaire × quantité),
// arrondie au centième comme la colonne Decimal(15, 2) qui la stocke.
export function computeFootprint(lines) {
  const total = lines.reduce((sum, { carbonFootprint, quantity }) => sum + Number(carbonFootprint) * quantity, 0);
  return Math.round(total * 100) / 100;
}
