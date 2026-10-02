import { UseCase } from '../UseCase.js';

export class SendContactMessage extends UseCase {
  execute(message) {
    return this.contactRepository.send(message);
  }
}
