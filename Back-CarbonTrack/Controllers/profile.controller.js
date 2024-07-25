// profile.controller.js
import { ProfileService } from '../Services/profile.services.js';

const profileService = new ProfileService();

class ProfileController {
    
    getProfileById() {
        return async (req, res) => {
            const userId = parseInt(req.userId, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
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

    updateProfileById() {
        return async (req, res) => {
            const userId = parseInt(req.userId, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            const profileData = req.body;
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
}

export const profileController = new ProfileController();