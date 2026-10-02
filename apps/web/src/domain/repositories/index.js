const aImplementer = (classe, methode) => {
  throw new Error(`${classe} doit implémenter ${methode}()`);
};

export class AuthRepository {
  login() {
    aImplementer('AuthRepository', 'login');
  }
  register() {
    aImplementer('AuthRepository', 'register');
  }
  googleRedirectUrl() {
    aImplementer('AuthRepository', 'googleRedirectUrl');
  }
  requestPasswordReset() {
    aImplementer('AuthRepository', 'requestPasswordReset');
  }
  resetPassword() {
    aImplementer('AuthRepository', 'resetPassword');
  }
  checkResetToken() {
    aImplementer('AuthRepository', 'checkResetToken');
  }
}

export class SessionRepository {
  read() {
    aImplementer('SessionRepository', 'read');
  }
  save() {
    aImplementer('SessionRepository', 'save');
  }
  clear() {
    aImplementer('SessionRepository', 'clear');
  }
  consumeFromUrl() {
    aImplementer('SessionRepository', 'consumeFromUrl');
  }
}

export class UserRepository {
  profile() {
    aImplementer('UserRepository', 'profile');
  }
  updateProfile() {
    aImplementer('UserRepository', 'updateProfile');
  }
  deleteAccount() {
    aImplementer('UserRepository', 'deleteAccount');
  }
  listAll() {
    aImplementer('UserRepository', 'listAll');
  }
  changePassword() {
    aImplementer('UserRepository', 'changePassword');
  }
  changeRole() {
    aImplementer('UserRepository', 'changeRole');
  }
  removeUser() {
    aImplementer('UserRepository', 'removeUser');
  }
}

export class CatalogRepository {
  listCategories() {
    aImplementer('CatalogRepository', 'listCategories');
  }
  listCategoriesWithMaterials() {
    aImplementer('CatalogRepository', 'listCategoriesWithMaterials');
  }
  createCategory() {
    aImplementer('CatalogRepository', 'createCategory');
  }
  updateCategory() {
    aImplementer('CatalogRepository', 'updateCategory');
  }
  deleteCategory() {
    aImplementer('CatalogRepository', 'deleteCategory');
  }
  countMaterials() {
    aImplementer('CatalogRepository', 'countMaterials');
  }
  listMaterials() {
    aImplementer('CatalogRepository', 'listMaterials');
  }
  material() {
    aImplementer('CatalogRepository', 'material');
  }
  createMaterial() {
    aImplementer('CatalogRepository', 'createMaterial');
  }
  updateMaterial() {
    aImplementer('CatalogRepository', 'updateMaterial');
  }
  deleteMaterial() {
    aImplementer('CatalogRepository', 'deleteMaterial');
  }
}

export class ProjectRepository {
  list() {
    aImplementer('ProjectRepository', 'list');
  }
  get() {
    aImplementer('ProjectRepository', 'get');
  }
  listAll() {
    aImplementer('ProjectRepository', 'listAll');
  }
  create() {
    aImplementer('ProjectRepository', 'create');
  }
  update() {
    aImplementer('ProjectRepository', 'update');
  }
  remove() {
    aImplementer('ProjectRepository', 'remove');
  }
}

export class ContactRepository {
  send() {
    aImplementer('ContactRepository', 'send');
  }
}
