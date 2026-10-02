// Réglages communs aux graphiques Chart.js : mêmes jetons que l'interface,
// libellés en français.
export const ACCENT = '#34d399';
export const ACCENT_SOFT = 'rgba(52, 211, 153, 0.18)';
export const SAP = '#a3e635';

// Palette catégorielle : tons distincts et de luminosité proche, pour qu'aucune
// part ne paraisse plus importante qu'une autre à cause de sa couleur.
export const SERIE = ['#34d399', '#a3e635', '#38bdf8', '#fbbf24', '#fb7185', '#c084fc', '#2dd4bf'];

const INK_MUTED = '#9aada4';
const LINE = '#1f2a25';

export const moisDeLAnnee = () => {
  const annee = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, i) =>
    new Date(annee, i).toLocaleString('fr-FR', { month: 'short' }),
  );
};

const infobulle = {
  backgroundColor: '#18211d',
  borderColor: LINE,
  borderWidth: 1,
  titleColor: '#eaf2ee',
  bodyColor: '#9aada4',
  padding: 10,
  cornerRadius: 8,
};

export const optionsGraphique = ({ titreAxeY = '' } = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: INK_MUTED, boxWidth: 12, usePointStyle: true } },
    tooltip: infobulle,
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

export const optionsAnneau = () => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: { position: 'bottom', labels: { color: INK_MUTED, boxWidth: 10, usePointStyle: true } },
    tooltip: infobulle,
  },
});
