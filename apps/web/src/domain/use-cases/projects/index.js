import { UseCase } from '../UseCase.js';
import { Footprint } from '../../entities/Footprint.js';

export class ListProjects extends UseCase {
  execute(options = {}) {
    return this.projectRepository.list(options);
  }
}

export class ListAllProjects extends UseCase {
  execute(options = {}) {
    return this.projectRepository.listAll(options);
  }
}

export class GetProject extends UseCase {
  execute(id) {
    return this.projectRepository.get(id);
  }
}

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
  async execute({ materials, ...contexte }) {
    return this.projectRepository.create({ ...contexte, materials: verifierLignes(materials) });
  }
}

export class UpdateProject extends UseCase {
  async execute(id, { materials, ...contexte }) {
    return this.projectRepository.update(id, { ...contexte, materials: verifierLignes(materials) });
  }
}

export class DeleteProject extends UseCase {
  execute(id) {
    return this.projectRepository.remove(id);
  }
}

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
