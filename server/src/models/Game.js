import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isRunning: { type: Boolean, default: false },
  settings: {
    locationBroadcastHz: { type: Number, default: 1 },
    mapBase: { type: String, default: 'openstreetmap' }
  }
}, { timestamps: true })

export default mongoose.model('Game', gameSchema)
