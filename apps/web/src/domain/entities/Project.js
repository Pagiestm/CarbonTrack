import { Footprint } from './Footprint.js';

export class ProjectLine {
  constructor({ materialId, quantity, material = null }) {
    this.materialId = materialId;
    this.quantity = Number(quantity);
    this.material = material;
  }

  get footprint() {
    return this.material ? this.material.footprintFor(this.quantity) : new Footprint(0);
  }

  get cost() {
    return this.material ? this.material.costFor(this.quantity) : 0;
  }
}

export const PROJECT_KINDS = {
  NEUF: 'Construction neuve',
  RENOVATION: 'Rénovation',
  EXTENSION: 'Extension',
  AMENAGEMENT: 'Aménagement',
};

export const PROJECT_STATUSES = {
  DRAFT: 'Brouillon',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
};

export class Project {
  constructor({
    id,
    name,
    description,
    totalFootprint,
    userId,
    createdAt = null,
    lines = [],
    lineCount = null,
    location = null,
    surface = null,
    kind = 'NEUF',
    status = 'DRAFT',
    startDate = null,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
    this.createdAt = createdAt;
    this.lines = lines;
    this.location = location;
    this.surface = surface === null ? null : Number(surface);
    this.kind = kind;
    this.status = status;
    this.startDate = startDate;
    this.totalFootprint = new Footprint(totalFootprint ?? 0);
    this.lineCount = lineCount ?? lines.length;
  }

  get cost() {
    return this.lines.reduce((total, ligne) => total + ligne.cost, 0);
  }

  get kindLabel() {
    return PROJECT_KINDS[this.kind] ?? this.kind;
  }

  get statusLabel() {
    return PROJECT_STATUSES[this.status] ?? this.status;
  }

  get footprintPerSquareMeter() {
    if (!this.surface) return null;
    return new Footprint(this.totalFootprint.kg / this.surface);
  }

  get costPerSquareMeter() {
    if (!this.surface) return null;
    return this.cost / this.surface;
  }

  get dominantLine() {
    return this.repartition[0]?.ligne ?? null;
  }

  get repartition() {
    const total = this.totalFootprint.kg || 1;
    return [...this.lines]
      .sort((a, b) => b.footprint.kg - a.footprint.kg)
      .map((ligne) => ({ ligne, part: (ligne.footprint.kg / total) * 100 }));
  }
}
