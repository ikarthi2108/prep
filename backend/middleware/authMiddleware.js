import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
export default function requireAuth(req, res, next) {
  const [scheme, token, extra] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token || extra) return res.status(401).json({ message: 'Bearer token required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!mongoose.isObjectIdOrHexString(payload.sub)) throw new Error('Invalid user ID');
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
}
