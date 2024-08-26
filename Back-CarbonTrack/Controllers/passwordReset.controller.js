import { PasswordResetService } from '../Services/passwordReset.services.js';

const passwordResetService = new PasswordResetService();

class PasswordResetController {
  requestPasswordReset() {
    return async (req, res) => {
      const { email } = req.body;
      try {
        const response = await passwordResetService.requestPasswordReset(email);
        res.status(200).json(response);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
  }

  resetPassword() {
    return async (req, res) => {
      const { token, newPassword, confirmPassword } = req.body;

      // Regex for password validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>;'\[\]\\\/`~_\-+=])[A-Za-z\d!@#$%^&*(),.?":{}|<>;'\[\]\\\/`~_\-+=]{8,}$/;

      // Validate password
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long, contain at least one number, one symbol, one lowercase and one uppercase letter.' });
      }

      try {
        const response = await passwordResetService.resetPassword(token, newPassword, confirmPassword);
        res.status(200).json(response);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
  }
}

export const passwordResetController = new PasswordResetController();