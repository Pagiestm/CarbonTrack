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
  execute() {
    return this.userRepository.listAll();
  }
}
