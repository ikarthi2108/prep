import { Router } from 'express';
import mongoose from 'mongoose';
import { getAll, getOne, create, update, remove } from '../controllers/studentController.js';
const router = Router();
router.param('id', (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) return res.status(400).json({ message: 'Invalid ObjectId' });
  next();
});
router.route('/').get(getAll).post(create);
router.route('/:id').get(getOne).put(update).delete(remove);
export default router;
