import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 500 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  department: { type: String, required: true, trim: true, maxlength: 500 },
  designation: { type: String, required: true, trim: true, maxlength: 500 },
  salary: { type: Number, required: true, min: 0 }
}, { timestamps: true });
export default mongoose.model('Employee', schema);
