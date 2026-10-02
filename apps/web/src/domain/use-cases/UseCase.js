/**
 * Un cas d'usage = une action métier, une classe, une méthode `execute`.
 *
 * Il reçoit ses dépôts par le constructeur (injection), jamais par un import
 * direct : c'est ce qui permet de le tester avec un faux dépôt, sans réseau.
 */
export class UseCase {
  constructor(dependances = {}) {
    Object.assign(this, dependances);
  }

  execute() {
    throw new Error(`${this.constructor.name} doit implémenter execute()`);
  }
}
