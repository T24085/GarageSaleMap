import { useEffect, useRef, useState } from 'react'
import SimplePeer from 'simple-peer'

export default function usePeerConnection (socket) {
  const peerRef = useRef(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!socket) return

    const handleOffer = ({ from, sdp }) => {
      const peer = new SimplePeer({ initiator: false, trickle: false })
      bindPeer(peer)
      peer.signal(sdp)
      peerRef.current = peer
    }

    const handleAnswer = ({ sdp }) => {
      peerRef.current?.signal(sdp)
    }

    const handleCandidate = ({ candidate }) => {
      peerRef.current?.signal(candidate)
    }

    socket.on('webrtc_offer', handleOffer)
    socket.on('webrtc_answer', handleAnswer)
    socket.on('webrtc_candidate', handleCandidate)

    return () => {
      socket.off('webrtc_offer', handleOffer)
      socket.off('webrtc_answer', handleAnswer)
      socket.off('webrtc_candidate', handleCandidate)
    }
  }, [socket])

  const bindPeer = (peer) => {
    peer.on('signal', (signal) => {
      if (!socket) return
      if (signal.type === 'offer') {
        socket.emit('webrtc_offer', { gameId: 'demo-game', sdp: signal, to: null })
      } else if (signal.type === 'answer') {
        socket.emit('webrtc_answer', { gameId: 'demo-game', sdp: signal, to: null })
      } else {
        socket.emit('webrtc_candidate', { gameId: 'demo-game', candidate: signal, to: null })
      }
    })

    peer.on('stream', (remoteStream) => {
      const audio = new Audio()
      audio.srcObject = remoteStream
      audio.play().catch(() => console.warn('autoplay prevented'))
    })

    peer.on('close', () => {
      setIsActive(false)
    })
  }

  const startCall = async () => {
    if (!socket) return

    const media = await navigator.mediaDevices.getUserMedia({ audio: true })
    const peer = new SimplePeer({ initiator: true, trickle: false, stream: media })
    bindPeer(peer)
    peerRef.current = peer
    setIsActive(true)
  }

  const endCall = () => {
    peerRef.current?.destroy()
    peerRef.current = null
    setIsActive(false)
  }

  return { startCall, endCall, isActive }
}
