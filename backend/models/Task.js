import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 500 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending', required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', required: true },
  dueDate: { type: Date, required: true }
}, { timestamps: true });
export default mongoose.model('Task', schema);
