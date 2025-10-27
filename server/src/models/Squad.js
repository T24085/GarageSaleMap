import mongoose from 'mongoose'

const squadSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  name: { type: String, required: true },
  color: { type: String, default: '#FFFFFF' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

export default mongoose.model('Squad', squadSchema)
