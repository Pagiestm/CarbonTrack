// profile.controller.js
import { ProfileService } from '../Services/profile.services.js';

const profileService = new ProfileService();

class ProfileController {

    getProfileById() {
        return async (req, res) => {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User not authenticated' });
            }
            try {
                const user = await profileService.getProfile(userId);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.status(200).json({ user });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }

    getAllUsers() {
        return async (req, res) => {
            try {
                const users = await profileService.getAllUsers();
                res.status(200).json({ users });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }

    updateProfileById() {
        return async (req, res) => {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User not authenticated' });
            }
            const profileData = req.body;

            // Validation des données de mise à jour
            const allowedFields = ['name', 'email'];
            const invalidFields = Object.keys(profileData).filter(
                key => !allowedFields.includes(key)
            );

            if (invalidFields.length > 0) {
                return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
            }

            // Vérification du format de l'email
            if (profileData.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(profileData.email)) {
                    return res.status(400).json({ error: 'Invalid email format' });
                }
            }

            try {
                const user = await profileService.updateProfile(userId, profileData);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.status(200).json({ user });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }

    deleteAccount() {
        return async (req, res) => {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User not authenticated' });
            }

            try {
                await profileService.deleteUserAndProjects(userId);
                res.status(200).json({ message: 'Account and related projects deleted successfully' });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
    }
}

export const profileController = new ProfileController();