export const ACCENT = '#15803d';
export const ACCENT_SOFT = 'rgba(21, 128, 61, 0.12)';

export const SERIE = ['#2f6f4e', '#4a6fa5', '#b07d48', '#6b7f8e', '#7a5c8e', '#a4504b', '#3f7d7b'];

const INK_MUTED = '#57534e';
const LINE = '#e7e5e4';

export const moisDeLAnnee = () => {
  const annee = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, i) =>
    new Date(annee, i).toLocaleString('fr-FR', { month: 'short' }),
  );
};

const infobulle = {
  backgroundColor: '#1c1917',
  titleColor: '#fafaf9',
  bodyColor: '#d6d3d1',
  padding: 10,
  cornerRadius: 6,
  displayColors: false,
};

export const optionsGraphique = ({ titreAxeY = '' } = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: infobulle,
  },
  scales: {
    x: { ticks: { color: INK_MUTED }, grid: { display: false } },
    y: {
      beginAtZero: true,
      ticks: { color: INK_MUTED, precision: 0 },
      grid: { color: LINE },
      border: { display: false },
      title: { display: Boolean(titreAxeY), text: titreAxeY, color: INK_MUTED },
    },
  },
});

export const optionsAnneau = ({ legende = false } = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '66%',
  plugins: {
    legend: legende
      ? {
          position: 'bottom',
          labels: { color: INK_MUTED, boxWidth: 10, usePointStyle: true, padding: 14 },
        }
      : { display: false },
    tooltip: infobulle,
  },
});

export const optionsBarresHorizontales = () => ({
  ...optionsGraphique(),
  indexAxis: 'y',
  scales: {
    x: { beginAtZero: true, ticks: { color: INK_MUTED }, grid: { color: LINE } },
    y: {
      ticks: { color: INK_MUTED, autoSkip: false, font: { size: 11 } },
      grid: { display: false },
      border: { display: false },
    },
  },
});
