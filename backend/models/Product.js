import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 500 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true, maxlength: 500 },
  stock: { type: Number, required: true, min: 0, validate: { validator: Number.isInteger, message: "Stock must be an integer" } }
}, { timestamps: true });
export default mongoose.model('Product', schema);
