import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from './email.services.js';
import querystring from 'querystring';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Vérifie si le fichier .env.local existe
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';

// Charge les variables d'environnement à partir du fichier approprié
dotenv.config({ path: envPath });

const prisma = new PrismaClient();

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charge et compile le template HTML
const templatePath = path.resolve(__dirname, '../../Front-CarbonTrack/src/components/email/registrationConfirmation.html');
const source = fs.readFileSync(templatePath, 'utf-8');
const template = handlebars.compile(source);

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

export class AuthService {
  async register(email, password, name, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    // Prépare le contenu de l'email en utilisant le template HTML
    const htmlContent = template({ name: user.name });

    // Envoi de l'email de confirmation
    await sendEmail(user.email, 'Confirmation d\'inscription', htmlContent, true);

    return user;
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return { token, user };
  }

  async googleAuth() {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    };
    return `${googleAuthUrl}?${querystring.stringify(params)}`;
  }

  async googleAuthCallback(code) {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const tokenParams = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    };

    const response = await axios.post(tokenUrl, querystring.stringify(tokenParams));
    const { access_token } = response.data;

    const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const userInfoResponse = await axios.get(userInfoUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name, id: googleId} = userInfoResponse.data;

    // Vérifie si l'utilisateur existe déjà dans votre base de données
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Créez un nouvel utilisateur si nécessaire
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: '',
          role: 'USER',
          googleId,
        },
      });

      // Prépare le contenu de l'email en utilisant le template HTML
      const htmlContent = template({ name: user.name });

      // Envoi de l'email de confirmation
      await sendEmail(user.email, 'Confirmation d\'inscription', htmlContent, true);
    }

    // Génére un jeton JWT pour l'utilisateur
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { token, user };
  }
}