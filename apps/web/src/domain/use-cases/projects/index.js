import { UseCase } from '../UseCase.js';
import { Footprint } from '../../entities/Footprint.js';

export class ListProjects extends UseCase {
  execute() {
    return this.projectRepository.list();
  }
}

export class ListAllProjects extends UseCase {
  execute() {
    return this.projectRepository.listAll();
  }
}

export class GetProject extends UseCase {
  execute(id) {
    return this.projectRepository.get(id);
  }
}

/**
 * Une ligne sans matériau ou de quantité nulle n'a pas de sens, et un même
 * matériau ne peut pas figurer deux fois : l'API applique la même règle, on
 * l'applique aussi ici pour ne pas faire un aller-retour pour rien.
 */
const verifierLignes = (lignes) => {
  const valides = lignes.filter((l) => l.materialId && Number(l.quantity) > 0);
  if (!valides.length) {
    throw new Error('Ajoutez au moins un matériau avec une quantité');
  }
  const ids = valides.map((l) => Number(l.materialId));
  if (new Set(ids).size !== ids.length) {
    throw new Error("Un matériau ne peut figurer qu'une fois dans un projet");
  }
  return valides.map((l) => ({ materialId: Number(l.materialId), quantity: Number(l.quantity) }));
};

export class CreateProject extends UseCase {
  async execute({ name, description, materials }) {
    return this.projectRepository.create({
      name,
      description,
      materials: verifierLignes(materials),
    });
  }
}

export class UpdateProject extends UseCase {
  async execute(id, { name, description, materials }) {
    return this.projectRepository.update(id, {
      name,
      description,
      materials: verifierLignes(materials),
    });
  }
}

export class DeleteProject extends UseCase {
  execute(id) {
    return this.projectRepository.remove(id);
  }
}

/**
 * Estime l'empreinte d'une sélection avant d'enregistrer le projet, pour que
 * le formulaire affiche un total qui bouge pendant la saisie. L'API reste la
 * source de vérité au moment de l'enregistrement.
 */
export class EstimateFootprint extends UseCase {
  execute(lignes, materiauxParId) {
    return Footprint.somme(
      lignes
        .filter((l) => l.materialId && Number(l.quantity) > 0)
        .map((l) => {
          const materiau = materiauxParId.get(Number(l.materialId));
          return materiau ? materiau.footprintFor(l.quantity) : new Footprint(0);
        }),
    );
  }
}
