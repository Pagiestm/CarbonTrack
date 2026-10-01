import { http } from './http';

// Module contact de l'API : /contact

export const sendContactMessage = async (contactData) => (await http.post('/contact', contactData)).data;
