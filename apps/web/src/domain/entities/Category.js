export class Category {
  constructor({ id, name, materials = [] }) {
    this.id = id;
    this.name = name;
    this.materials = materials;
  }
}
