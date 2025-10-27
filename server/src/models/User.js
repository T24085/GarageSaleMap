import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  avatarUrl: { type: String },
  roles: { type: [String], default: ['player'] }
}, { timestamps: true })

export default mongoose.model('User', userSchema)
