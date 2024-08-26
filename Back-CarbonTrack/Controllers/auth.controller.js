import { AuthService } from '../Services/auth.services.js';

const authService = new AuthService();

class AuthController {
    
    register() {
        return async (req, res) => {
            const { email, password, name } = req.body;
            const role = 'USER';

            // Regex for password validation
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>;'\[\]\\\/`~_\-+=])[A-Za-z\d!@#$%^&*(),.?":{}|<>;'\[\]\\\/`~_\-+=]{8,}$/;
            // Regex for email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validate password
            if (!passwordRegex.test(password)) {
                return res.status(400).json({ error: 'Password must be at least 8 characters long, contain at least one number, one symbol, one lowercase and one uppercase letter.' });
            }

            // Validate email
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format.' });
            }

            try {
                const user = await authService.register(email, password, name, role);
                res.status(201).json({ user });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }

    login() {
        return async (req, res) => {
            const { email, password } = req.body;
            try {
                const { token, user } = await authService.login(email, password);
                res.status(200).json({ token, user });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }
}

export const authController = new AuthController();