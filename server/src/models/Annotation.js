import mongoose from 'mongoose'

const geometrySchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  path: [{ lat: Number, lng: Number }]
}, { _id: false })

const annotationSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  type: { type: String, enum: ['marker', 'polyline', 'polygon'], required: true },
  geometry: { type: geometrySchema, required: true },
  properties: {
    label: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    icon: String,
    expiresAt: Date
  }
}, { timestamps: true })

export default mongoose.model('Annotation', annotationSchema)
