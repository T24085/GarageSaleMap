import jwt from 'jsonwebtoken'

export const authSocket = (io) => {
  io.use((socket, next) => {
    try {
      const header = socket.handshake.headers.authorization
      const token = header?.startsWith('Bearer ')
        ? header.substring(7)
        : socket.handshake.auth?.token

      if (!token) {
        return next(new Error('Authentication required'))
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET)
      socket.user = payload
      return next()
    } catch (err) {
      return next(new Error('Invalid token'))
    }
  })
}
