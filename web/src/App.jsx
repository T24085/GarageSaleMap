import { useEffect, useState } from 'react'
import MapView from './components/MapView.jsx'
import VoicePanel from './components/VoicePanel.jsx'
import useSocket from './hooks/useSocket.js'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000'

export default function App () {
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const socket = useSocket(token, SERVER_URL)

  useEffect(() => {
    if (socket && token) {
      socket.emit('join_game', { gameId: 'demo-game', userId: username || 'demo-user' })
    }
    return () => {
      socket?.emit('leave_game', { gameId: 'demo-game', userId: username || 'demo-user' })
    }
  }, [socket, token, username])

  const handleLogin = async (event) => {
    event.preventDefault()
    const response = await fetch(`${SERVER_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
    const data = await response.json()
    setToken(data.token)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>SimTak</h1>
        <form onSubmit={handleLogin}>
          <label>
            Callsign
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="RangerOne" />
          </label>
          <button type="submit">Connect</button>
        </form>
        {token && <VoicePanel socket={socket} />}
      </aside>
      <main>
        <MapView socket={socket} />
      </main>
    </div>
  )
}
