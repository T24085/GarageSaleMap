import Annotation from '../models/Annotation.js'
import Squad from '../models/Squad.js'

export const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('[socket] connected', socket.id)

    socket.on('join_game', ({ gameId, userId }) => {
      socket.join(gameId)
      socket.to(gameId).emit('player_joined', { userId })
    })

    socket.on('leave_game', ({ gameId, userId }) => {
      socket.leave(gameId)
      socket.to(gameId).emit('player_left', { userId })
    })

    socket.on('location_update', ({ gameId, ...payload }) => {
      io.to(gameId).emit('player_location', { userId: socket.user?.id, ...payload })
    })

    socket.on('create_squad', async ({ gameId, squadId, name, color }) => {
      await Squad.create({ _id: squadId, gameId, name, color, members: [socket.user?.id] })
      io.to(gameId).emit('squad_update', { squadId, members: [socket.user?.id] })
    })

    socket.on('join_squad', async ({ gameId, squadId, userId }) => {
      await Squad.updateOne({ _id: squadId }, { $addToSet: { members: userId } })
      io.to(gameId).emit('squad_update', { squadId, members: (await Squad.findById(squadId)).members })
    })

    socket.on('leave_squad', async ({ gameId, squadId, userId }) => {
      await Squad.updateOne({ _id: squadId }, { $pull: { members: userId } })
      io.to(gameId).emit('squad_update', { squadId, members: (await Squad.findById(squadId)).members })
    })

    socket.on('map_annot_create', async ({ gameId, annotation }) => {
      const created = await Annotation.create({ gameId, ...annotation })
      io.to(gameId).emit('map_annot_created', created)
    })

    socket.on('map_annot_update', async ({ gameId, annotationId, patch }) => {
      const updated = await Annotation.findByIdAndUpdate(annotationId, patch, { new: true })
      io.to(gameId).emit('map_annot_updated', updated)
    })

    socket.on('map_annot_delete', async ({ gameId, annotationId }) => {
      await Annotation.findByIdAndDelete(annotationId)
      io.to(gameId).emit('map_annot_deleted', { annotationId })
    })

    socket.on('chat_message', ({ gameId, ...message }) => {
      io.to(gameId).emit('chat_message', { from: socket.user?.id, ...message })
    })

    const signalEvents = ['webrtc_offer', 'webrtc_answer', 'webrtc_candidate']
    signalEvents.forEach((event) => {
      socket.on(event, ({ gameId, to, ...payload }) => {
        if (to) {
          io.to(to).emit(event, { from: socket.id, ...payload })
        } else {
          io.to(gameId).emit(event, { from: socket.id, ...payload })
        }
      })
    })

    socket.on('disconnect', () => {
      console.log('[socket] disconnected', socket.id)
    })
  })
}
