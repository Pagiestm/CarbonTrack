import { UseCase } from '../UseCase.js';

export class GetProfile extends UseCase {
  execute() {
    return this.userRepository.profile();
  }
}

export class UpdateProfile extends UseCase {
  execute(champs) {
    return this.userRepository.updateProfile(champs);
  }
}

export class DeleteAccount extends UseCase {
  async execute() {
    await this.userRepository.deleteAccount();
    this.sessionRepository.clear();
  }
}

export class ListUsers extends UseCase {
  execute(options = {}) {
    return this.userRepository.listAll(options);
  }
}

export class ChangePassword extends UseCase {
  async execute({ currentPassword, newPassword, confirmPassword }) {
    if (newPassword !== confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    if (currentPassword === newPassword) {
      throw new Error("Le nouveau mot de passe doit être différent de l'actuel");
    }
    return this.userRepository.changePassword({ currentPassword, newPassword, confirmPassword });
  }
}

export class ChangeUserRole extends UseCase {
  execute(id, role) {
    return this.userRepository.changeRole(id, role);
  }
}

export class DeleteUser extends UseCase {
  execute(id) {
    return this.userRepository.removeUser(id);
  }
}
