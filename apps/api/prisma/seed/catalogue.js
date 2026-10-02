export const CATALOGUE = [
  {
    categorie: 'Gros œuvre',
    materiaux: [
      ['Béton C25/30', 'Lafarge', 245.5, 'm³', 120],
      ['Béton bas carbone CEM III', 'Hoffmann Green', 128, 'm³', 165],
      ['Parpaing creux 20 cm', 'Point P', 0.9, 'unité', 1.4],
      ['Brique terre cuite 20 cm', 'Wienerberger', 1.6, 'unité', 2.1],
      ['Brique de terre crue', 'Cycle Terre', 0.18, 'unité', 3.4],
      ['Acier HA pour béton armé', 'ArcelorMittal', 1.95, 'kg', 1.2],
      ['Mortier de pose', 'Weber', 0.21, 'kg', 0.35],
      ['Bloc béton cellulaire', 'Ytong', 3.2, 'unité', 4.6],
    ],
  },
  {
    categorie: 'Isolation',
    materiaux: [
      ['Laine de bois 145 mm', 'Steico', 12.4, 'm²', 28],
      ['Ouate de cellulose soufflée', 'Igloo France', 4.8, 'm²', 14],
      ['Laine de chanvre 100 mm', 'Biofib', 6.1, 'm²', 22],
      ['Botte de paille compressée', 'Filière paille', 0.9, 'm²', 7],
      ['Liège expansé 80 mm', 'Amorim', 8.4, 'm²', 41],
      ['Polystyrène expansé 100 mm', 'Knauf', 21.6, 'm²', 16],
      ['Polyuréthane projeté 80 mm', 'Soprema', 34.2, 'm²', 29],
      ['Laine de verre 200 mm', 'Isover', 9.3, 'm²', 12],
      ['Laine de roche 160 mm', 'Rockwool', 14.8, 'm²', 19],
    ],
  },
  {
    categorie: 'Charpente et ossature',
    materiaux: [
      ['Bois lamellé-collé épicéa', 'Piveteau', 65, 'm³', 850],
      ['Ossature sapin douglas', 'Scierie du Morvan', 42, 'm³', 620],
      ['Poutre chêne massif', 'Groupe Ducerf', 38, 'm³', 1450],
      ['Poutrelle acier IPN', 'ArcelorMittal', 2.1, 'kg', 1.8],
      ['Panneau CLT 5 plis', 'Stora Enso', 78, 'm³', 1180],
      ['Contreventement OSB 12 mm', 'Kronospan', 7.6, 'm²', 11],
    ],
  },
  {
    categorie: 'Menuiserie',
    materiaux: [
      ['Fenêtre bois double vitrage', 'Menuiserie Dubois', 86, 'unité', 640],
      ['Fenêtre bois triple vitrage', 'Menuiserie Dubois', 112, 'unité', 890],
      ['Fenêtre PVC double vitrage', 'Veka', 124, 'unité', 420],
      ['Fenêtre aluminium', 'Technal', 168, 'unité', 720],
      ['Porte d’entrée aluminium', 'Technal', 196, 'unité', 1250],
      ['Porte intérieure bois', 'Lapeyre', 24, 'unité', 180],
      ['Volet roulant alu', 'Bubendorff', 92, 'unité', 480],
    ],
  },
  {
    categorie: 'Couverture',
    materiaux: [
      ['Tuile terre cuite', 'Terreal', 0.65, 'unité', 1.1],
      ['Ardoise naturelle', 'Cupa Pizarras', 1.2, 'unité', 2.8],
      ['Bac acier isolé', 'Arval', 18.5, 'm²', 34],
      ['Membrane EPDM', 'Firestone', 6.8, 'm²', 26],
      ['Zinc en feuille', 'VMZinc', 9.4, 'm²', 68],
    ],
  },
  {
    categorie: 'Revêtements de sol',
    materiaux: [
      ['Parquet chêne massif', 'Panaget', 11.2, 'm²', 78],
      ['Carrelage grès cérame', 'Porcelanosa', 17.4, 'm²', 42],
      ['Béton ciré', 'Mercadier', 9.1, 'm²', 55],
      ['Linoléum naturel', 'Forbo', 4.3, 'm²', 31],
      ['Moquette fibres recyclées', 'Interface', 7.9, 'm²', 38],
    ],
  },
  {
    categorie: 'Second œuvre',
    materiaux: [
      ['Plaque de plâtre BA13', 'Placo', 2.9, 'm²', 6.2],
      ['Enduit chaux-chanvre', 'Tradical', 1.4, 'm²', 18],
      ['Peinture minérale', 'Keim', 2.1, 'm²', 9.5],
      ['Rail et montant acier', 'Placo', 1.8, 'm²', 4.3],
    ],
  },
  {
    categorie: 'Équipements techniques',
    materiaux: [
      ['Pompe à chaleur air-eau', 'Atlantic', 1840, 'unité', 9800],
      ['Chaudière gaz condensation', 'Viessmann', 1240, 'unité', 4200],
      ['Panneau photovoltaïque 400 W', 'Voltec Solar', 412, 'unité', 280],
      ['Ballon thermodynamique', 'Thermor', 680, 'unité', 2400],
      ['VMC double flux', 'Aldes', 310, 'unité', 2100],
    ],
  },
  {
    categorie: 'Réseaux et câblage',
    materiaux: [
      ['Câble électrique cuivre 2,5 mm²', 'Nexans', 0.42, 'm', 1.1],
      ['Tube PER sanitaire', 'Comap', 0.31, 'm', 2.4],
      ['Gaine ICTA', 'Courant', 0.19, 'm', 0.9],
    ],
  },
  {
    categorie: 'Aménagement extérieur',
    materiaux: [
      ['Pavé béton drainant', 'Alkern', 2.4, 'm²', 29],
      ['Terrasse bois douglas', 'Scierie du Morvan', 6.2, 'm²', 62],
      ['Gravier calcaire', 'Carrières de l’Ouest', 0.012, 'kg', 0.04],
      ['Clôture grillagée acier', 'Dirickx', 14.8, 'm', 38],
    ],
  },
];

export const GABARITS = [
  {
    nom: 'Extension ossature bois',
    description: 'Extension sur dalle béton, isolation biosourcée, menuiseries bois.',
    lignes: [
      ['Béton C25/30', 14, 22],
      ['Ossature sapin douglas', 4, 8],
      ['Laine de bois 145 mm', 70, 120],
      ['Fenêtre bois double vitrage', 4, 8],
      ['Tuile terre cuite', 800, 1400],
      ['Plaque de plâtre BA13', 90, 150],
    ],
  },
  {
    nom: 'Garage double maçonnerie',
    description: 'Construction traditionnelle, couverture bac acier.',
    lignes: [
      ['Parpaing creux 20 cm', 1400, 2200],
      ['Béton C25/30', 7, 12],
      ['Bac acier isolé', 35, 55],
      ['Porte d’entrée aluminium', 1, 2],
      ['Mortier de pose', 800, 1400],
    ],
  },
  {
    nom: 'Rénovation thermique',
    description: 'Isolation par l’extérieur, remplacement des menuiseries, VMC.',
    lignes: [
      ['Laine de roche 160 mm', 110, 190],
      ['Fenêtre PVC double vitrage', 8, 16],
      ['VMC double flux', 1, 1],
      ['Enduit chaux-chanvre', 110, 190],
      ['Volet roulant alu', 6, 12],
    ],
  },
  {
    nom: 'Maison passive ossature bois',
    description: 'Construction neuve basse empreinte, panneaux CLT et paille.',
    lignes: [
      ['Panneau CLT 5 plis', 18, 30],
      ['Botte de paille compressée', 180, 280],
      ['Fenêtre bois triple vitrage', 10, 18],
      ['Pompe à chaleur air-eau', 1, 1],
      ['Panneau photovoltaïque 400 W', 10, 24],
      ['Parquet chêne massif', 90, 150],
    ],
  },
  {
    nom: 'Immeuble collectif R+3',
    description: 'Structure béton, 12 logements, chauffage collectif.',
    lignes: [
      ['Béton C25/30', 180, 280],
      ['Acier HA pour béton armé', 12000, 20000],
      ['Laine de verre 200 mm', 700, 1100],
      ['Fenêtre aluminium', 48, 72],
      ['Carrelage grès cérame', 700, 1100],
      ['Chaudière gaz condensation', 1, 2],
    ],
  },
  {
    nom: 'Surélévation bois',
    description: 'Ajout d’un niveau sur bâtiment existant, structure légère.',
    lignes: [
      ['Bois lamellé-collé épicéa', 8, 16],
      ['Contreventement OSB 12 mm', 120, 200],
      ['Ouate de cellulose soufflée', 110, 180],
      ['Membrane EPDM', 90, 140],
      ['Fenêtre bois double vitrage', 5, 10],
    ],
  },
  {
    nom: 'Atelier artisanal',
    description: 'Bâtiment d’activité, charpente métallique.',
    lignes: [
      ['Poutrelle acier IPN', 4500, 8000],
      ['Bac acier isolé', 280, 420],
      ['Béton C25/30', 40, 70],
      ['Pavé béton drainant', 160, 260],
    ],
  },
  {
    nom: 'Rénovation terre crue',
    description: 'Réhabilitation basse empreinte, matériaux géosourcés.',
    lignes: [
      ['Brique de terre crue', 2200, 3600],
      ['Enduit chaux-chanvre', 180, 280],
      ['Liège expansé 80 mm', 90, 150],
      ['Parquet chêne massif', 70, 120],
      ['Fenêtre bois double vitrage', 6, 11],
    ],
  },
  {
    nom: 'Aménagement de combles',
    description: 'Isolation, cloisons et menuiseries de toit.',
    lignes: [
      ['Laine de bois 145 mm', 55, 95],
      ['Plaque de plâtre BA13', 80, 130],
      ['Rail et montant acier', 80, 130],
      ['Parquet chêne massif', 45, 80],
      ['Peinture minérale', 120, 200],
    ],
  },
  {
    nom: 'Maison bioclimatique',
    description: 'Neuf, orientation sud, production solaire.',
    lignes: [
      ['Brique terre cuite 20 cm', 2800, 4200],
      ['Liège expansé 80 mm', 140, 220],
      ['Fenêtre bois triple vitrage', 12, 20],
      ['Panneau photovoltaïque 400 W', 14, 28],
      ['Ballon thermodynamique', 1, 1],
      ['Béton ciré', 90, 150],
    ],
  },
  {
    nom: 'Local commercial',
    description: 'Aménagement d’un plateau nu, cloisonnement et sols.',
    lignes: [
      ['Rail et montant acier', 200, 320],
      ['Plaque de plâtre BA13', 200, 320],
      ['Moquette fibres recyclées', 180, 300],
      ['Câble électrique cuivre 2,5 mm²', 900, 1600],
      ['VMC double flux', 1, 2],
    ],
  },
  {
    nom: 'Extension véranda',
    description: 'Structure aluminium et vitrage, dalle légère.',
    lignes: [
      ['Fenêtre aluminium', 10, 18],
      ['Béton C25/30', 5, 9],
      ['Terrasse bois douglas', 30, 55],
      ['Carrelage grès cérame', 25, 45],
    ],
  },
];
