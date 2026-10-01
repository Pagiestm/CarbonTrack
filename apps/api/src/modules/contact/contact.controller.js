import { sendContactMessage } from './contact.service.js';

export const contactController = {
  async send(req, res) {
    await sendContactMessage(req.valid.body);
    res.json({ message: 'Message envoyé avec succès' });
  },
};
