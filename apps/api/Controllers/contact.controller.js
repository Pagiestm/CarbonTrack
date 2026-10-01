import { ContactService } from '../Services/contact.services.js';

const contactService = new ContactService();

class ContactController {
  sendContactEmail() {
    return async (req, res) => {
      const { name, email, message } = req.body;

      // Vérifie que les champs ne sont pas vides
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
      }

      // Vérifie le format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Format d\'email invalide' });
      }

      try {
        await contactService.sendContactEmail(name, email, message);
        res.status(200).json({ message: 'Message envoyé avec succès' });
      } catch (error) {
        console.error('Erreur dans ContactController:', error);
        res.status(500).json({ error: error.message });
      }
    };
  }
}

export const contactController = new ContactController();