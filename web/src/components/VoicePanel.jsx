import { useEffect, useState } from 'react'
import usePeerConnection from '../hooks/usePeerConnection.js'

export default function VoicePanel ({ socket }) {
  const { startCall, endCall, isActive } = usePeerConnection(socket)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (!socket) return
    socket.emit('voice_mute', { gameId: 'demo-game', muted })
  }, [muted, socket])

  return (
    <section>
      <h2>Voice</h2>
      <div className="voice-controls">
        <button onClick={isActive ? endCall : startCall}>
          {isActive ? 'Hang Up' : 'Start Voice'}
        </button>
        <button onClick={() => setMuted((value) => !value)}>
          {muted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </section>
  )
}
