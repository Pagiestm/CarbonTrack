/**
 * Un compte CarbonTrack.
 *
 * Les entités ne connaissent ni HTTP, ni Vue, ni le format de l'API : elles
 * décrivent le métier et rien d'autre. C'est ce qui permet de les tester sans
 * rien démarrer.
 */
export class User {
  constructor({ id, email, name, role, googleId = null, createdAt = null }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
    this.googleId = googleId;
    this.createdAt = createdAt;
  }

  get isAdmin() {
    return this.role === 'ADMIN';
  }

  /** Un compte créé par Google n'a pas de mot de passe à modifier. */
  get isGoogleAccount() {
    return Boolean(this.googleId);
  }

  get initials() {
    return (this.name ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((mot) => mot[0].toUpperCase())
      .join('');
  }
}
