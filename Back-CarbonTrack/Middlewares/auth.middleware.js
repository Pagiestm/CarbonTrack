import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          console.log('Token verification failed', err);
          return res.status(403).json({ error: 'Access denied' });
      }
      console.log('Token verified, user:', user);
      req.userId = user.userId;
      next();
  });
};
