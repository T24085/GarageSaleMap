import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export default function useSocket (token, url) {
  const socketRef = useRef(null)

  useEffect(() => {
    if (!token) return

    socketRef.current = io(url, {
      transports: ['websocket'],
      auth: { token }
    })

    socketRef.current.on('connect', () => console.log('[socket] connected'))

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [token, url])

  return socketRef.current
}
