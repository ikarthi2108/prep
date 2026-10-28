import mongoose from 'mongoose';
export default async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in .env');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected');
}
