import { AuthService } from '../Services/auth.services.js';

const authService = new AuthService();

class AuthController {
    
    register() {
        return async (req, res) => {
            const { email, password, name } = req.body;
            console.log('Register request:', { email, password, name });
            try {
                const user = await authService.register(email, password, name);
                console.log('User created:', user);
                res.status(201).json({ user });
            } catch (error) {
                console.error('Register error:', error.message);
                res.status(400).json({ error: error.message });
            }
        };
    }

    login() {
        return async (req, res) => {
            const { email, password } = req.body;
            console.log('Login request:', { email, password });
            try {
                const { token, user } = await authService.login(email, password);
                console.log('Login successful:', { token, user });
                res.status(200).json({ token, user });
            } catch (error) {
                console.error('Login error:', error.message);
                res.status(400).json({ error: error.message });
            }
        };
    }
}

export const authController = new AuthController();