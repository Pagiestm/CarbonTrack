export class UseCase {
  constructor(dependances = {}) {
    Object.assign(this, dependances);
  }

  execute() {
    throw new Error(`${this.constructor.name} doit implémenter execute()`);
  }
}
