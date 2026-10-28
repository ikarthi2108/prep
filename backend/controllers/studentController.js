import Student from '../models/Student.js';

// Only accept known fields. Never pass an unfiltered request body to MongoDB.
const fields = ["name","email","course","marks"];
function cleanBody(body) {
  const result = {};
  for (const field of fields) {
    const value = body?.[field];
    if (value === undefined || value === null || String(value).trim() === '') {
      const error = new Error(field + ' is required');
      error.name = 'ValidationError';
      throw error;
    }
    if (typeof value === 'object' || typeof value === 'boolean') {
      const error = new Error(field + ' must be a simple value');
      error.name = 'ValidationError';
      throw error;
    }
    result[field] = value;
  }
  return result;
}

export async function getAll(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const query = {};
    // Escape regex metacharacters so searching treats user text literally.
    const escaped = Array.from(String(req.query.search || '')).map(char => ('^$.*+?()[]{}|' + String.fromCharCode(92)).includes(char) ? String.fromCharCode(92) + char : char).join('');
    if (escaped) query.$or = [{ name: { $regex: escaped, $options: 'i' } }, { email: { $regex: escaped, $options: 'i' } }];
    
    const allowedSort = ['createdAt', 'name'];
    const sortBy = allowedSort.includes(req.query.sort) ? req.query.sort : 'createdAt';
    const direction = req.query.order === 'asc' ? 1 : -1;
    const [items, total] = await Promise.all([
      Student.find(query).sort({ [sortBy]: direction, _id: 1 }).skip((page - 1) * limit).limit(limit),
      Student.countDocuments(query)
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
}

export async function getOne(req, res, next) {
  try {
    const item = await Student.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Student not found' });
    res.json(item);
  } catch (error) { next(error); }
}

export async function create(req, res, next) {
  try {
    const item = await Student.create(cleanBody(req.body));
    res.status(201).json(item);
  } catch (error) { next(error); }
}

export async function update(req, res, next) {
  try {
    const item = await Student.findByIdAndUpdate(req.params.id,
      { $set: cleanBody(req.body) }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Student not found' });
    res.json(item);
  } catch (error) { next(error); }
}

export async function remove(req, res, next) {
  try {
    const item = await Student.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (error) { next(error); }
}
