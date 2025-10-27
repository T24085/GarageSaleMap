import mongoose from 'mongoose'

export const connectDatabase = async (uri) => {
  if (mongoose.connection.readyState === 1) return mongoose.connection

  mongoose.connection.on('connected', () => {
    console.log('[db] connected')
  })

  mongoose.connection.on('error', (err) => {
    console.error('[db] connection error', err)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected')
  })

  await mongoose.connect(uri, {
    autoIndex: true
  })

  return mongoose.connection
}
