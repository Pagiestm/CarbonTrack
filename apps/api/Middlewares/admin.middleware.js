export const adminMiddleware = (req, res, next) => {
  if (req.userRole && req.userRole === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};