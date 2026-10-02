import { Footprint } from './Footprint.js';

export class Material {
  constructor({ id, name, supplier, carbonFootprint, unit, pricePerUnit, categoryId, category }) {
    this.id = id;
    this.name = name;
    this.supplier = supplier;
    this.carbonFootprint = Number(carbonFootprint);
    this.unit = unit;
    this.pricePerUnit = Number(pricePerUnit);
    this.categoryId = categoryId;
    this.category = category ?? null;
  }

  /** Empreinte pour une quantité donnée, en kg eq. CO₂. */
  footprintFor(quantity) {
    return new Footprint(this.carbonFootprint * Number(quantity));
  }

  costFor(quantity) {
    return this.pricePerUnit * Number(quantity);
  }
}
