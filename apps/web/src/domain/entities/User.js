export class User {
  constructor({
    id,
    email,
    name,
    role,
    googleId = null,
    createdAt = null,
    company = null,
    jobTitle = null,
    phone = null,
    city = null,
    projectCount = null,
  }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
    this.googleId = googleId;
    this.createdAt = createdAt;
    this.company = company;
    this.jobTitle = jobTitle;
    this.phone = phone;
    this.city = city;
    this.projectCount = projectCount;
  }

  get isAdmin() {
    return this.role === 'ADMIN';
  }

  get isGoogleAccount() {
    return Boolean(this.googleId);
  }

  get subtitle() {
    if (this.jobTitle && this.company) return `${this.jobTitle} chez ${this.company}`;
    return this.jobTitle ?? this.company ?? null;
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
