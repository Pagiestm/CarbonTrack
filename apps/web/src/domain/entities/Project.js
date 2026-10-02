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

export class Project {
  constructor({ id, name, description, totalFootprint, userId, createdAt = null, lines = [] }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
    this.createdAt = createdAt;
    this.lines = lines;
    this.totalFootprint = new Footprint(totalFootprint ?? 0);
  }

  get cost() {
    return this.lines.reduce((total, ligne) => total + ligne.cost, 0);
  }

  /**
   * Les lignes de la plus lourde à la plus légère, avec leur part du total :
   * c'est la question que se pose l'utilisateur en ouvrant un projet.
   */
  get repartition() {
    const total = this.totalFootprint.kg || 1;
    return [...this.lines]
      .sort((a, b) => b.footprint.kg - a.footprint.kg)
      .map((ligne) => ({ ligne, part: (ligne.footprint.kg / total) * 100 }));
  }
}
