export default function errorMiddleware(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.code === 11000) return res.status(409).json({ message: 'Email already exists' });
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON' });
  console.error(error.message);
  res.status(500).json({ message: 'Something went wrong on the server' });
}
