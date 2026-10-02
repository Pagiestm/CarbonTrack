// Réglages communs aux graphiques Chart.js : mêmes couleurs que le reste de
// l'application, et des libellés en français.
export const ACCENT = '#42b883';
export const ACCENT_SOFT = 'rgba(66, 184, 131, 0.18)';

const INK_MUTED = '#a7b0c0';
const LINE = '#262b38';

export const moisDeLAnnee = () => {
  const annee = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, i) =>
    new Date(annee, i).toLocaleString('fr-FR', { month: 'short' }),
  );
};

export const optionsGraphique = ({ titreAxeY = '' } = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: INK_MUTED, boxWidth: 12, usePointStyle: true } },
    tooltip: { backgroundColor: '#1d212c', borderColor: LINE, borderWidth: 1 },
  },
  scales: {
    x: { ticks: { color: INK_MUTED }, grid: { color: LINE } },
    y: {
      beginAtZero: true,
      // Des entiers : on compte des projets et des comptes, pas des demis.
      ticks: { color: INK_MUTED, precision: 0 },
      grid: { color: LINE },
      title: { display: Boolean(titreAxeY), text: titreAxeY, color: INK_MUTED },
    },
  },
});
