import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 500 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  course: { type: String, required: true, trim: true, maxlength: 500 },
  marks: { type: Number, required: true, min: 0, max: 100 }
}, { timestamps: true });
export default mongoose.model('Student', schema);
