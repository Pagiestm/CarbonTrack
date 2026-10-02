/**
 * Une empreinte carbone, en kg équivalent CO₂.
 *
 * Les seuils sont ici, et non dans un composant : c'est une règle métier, pas
 * une question d'affichage. Ils viennent des ordres de grandeur usuels pour un
 * projet de construction individuel.
 */
const SEUIL_FAIBLE = 1_000;
const SEUIL_MODERE = 10_000;

export class Footprint {
  constructor(valeurEnKg) {
    this.kg = Math.round(Number(valeurEnKg) * 100) / 100;
  }

  static somme(empreintes) {
    return new Footprint(empreintes.reduce((total, e) => total + e.kg, 0));
  }

  get tonnes() {
    return this.kg / 1000;
  }

  /** 'faible' | 'modere' | 'eleve' — sert à colorer et à hiérarchiser. */
  get niveau() {
    if (this.kg < SEUIL_FAIBLE) return 'faible';
    if (this.kg < SEUIL_MODERE) return 'modere';
    return 'eleve';
  }

  /**
   * Équivalent parlant : un kilomètre en voiture thermique émet environ
   * 0,193 kg eq. CO₂ (base carbone ADEME, voiture particulière moyenne).
   */
  get kilometresVoiture() {
    return Math.round(this.kg / 0.193);
  }

  format() {
    return this.kg >= 1000
      ? `${this.tonnes.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} t`
      : `${this.kg.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kg`;
  }
}
