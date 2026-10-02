import { UseCase } from '../UseCase.js';

export class Login extends UseCase {
  async execute({ email, password }) {
    const session = await this.authRepository.login({ email, password });
    this.sessionRepository.save(session.token);
    return session;
  }
}

export class Register extends UseCase {
  execute({ name, email, password }) {
    return this.authRepository.register({ name, email, password });
  }
}

export class StartGoogleLogin extends UseCase {
  execute() {
    return this.authRepository.googleRedirectUrl();
  }
}

export class FinishGoogleLogin extends UseCase {
  execute() {
    return this.sessionRepository.consumeFromUrl();
  }
}

export class Logout extends UseCase {
  execute() {
    this.sessionRepository.clear();
  }
}

export class CurrentSession extends UseCase {
  execute() {
    return this.sessionRepository.read();
  }
}

export class RequestPasswordReset extends UseCase {
  execute(email) {
    return this.authRepository.requestPasswordReset(email);
  }
}

export class CheckResetToken extends UseCase {
  execute(token) {
    return this.authRepository.checkResetToken(token);
  }
}

export class ResetPassword extends UseCase {
  async execute({ token, newPassword, confirmPassword }) {
    if (newPassword !== confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    return this.authRepository.resetPassword({ token, newPassword, confirmPassword });
  }
}
