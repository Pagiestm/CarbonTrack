import { UseCase } from '../UseCase.js';

export class ListCategories extends UseCase {
  execute() {
    return this.catalogRepository.listCategories();
  }
}

export class ListCategoriesWithMaterials extends UseCase {
  execute() {
    return this.catalogRepository.listCategoriesWithMaterials();
  }
}

export class CreateCategory extends UseCase {
  execute(nom) {
    return this.catalogRepository.createCategory(nom);
  }
}

export class UpdateCategory extends UseCase {
  execute(id, nom) {
    return this.catalogRepository.updateCategory(id, nom);
  }
}

export class DeleteCategory extends UseCase {
  execute(id) {
    return this.catalogRepository.deleteCategory(id);
  }
}

export class CountMaterials extends UseCase {
  execute() {
    return this.catalogRepository.countMaterials();
  }
}

export class ListMaterials extends UseCase {
  execute(options = {}) {
    return this.catalogRepository.listMaterials(options);
  }
}

export class ListAllMaterials extends UseCase {
  execute() {
    return this.catalogRepository.listMaterials({ all: 'true' });
  }
}

export class GetMaterial extends UseCase {
  execute(id) {
    return this.catalogRepository.material(id);
  }
}

export class CreateMaterial extends UseCase {
  execute(materiau) {
    return this.catalogRepository.createMaterial(materiau);
  }
}

export class UpdateMaterial extends UseCase {
  execute(id, materiau) {
    return this.catalogRepository.updateMaterial(id, materiau);
  }
}

export class DeleteMaterial extends UseCase {
  execute(id) {
    return this.catalogRepository.deleteMaterial(id);
  }
}
