import Foundation
import Combine
import WebRTC

final class WebRTCManager: NSObject, ObservableObject {
    static let shared = WebRTCManager()

    private var peerConnection: RTCPeerConnection?
    private var localAudioTrack: RTCAudioTrack?
    private var factory = RTCPeerConnectionFactory()

    @Published var isActive = false

    func startVoice(token: String, gameId: String) {
        let configuration = RTCConfiguration()
        configuration.sdpSemantics = .unifiedPlan
        configuration.iceServers = [RTCIceServer(urlStrings: ["stun:stun.l.google.com:19302"])]

        let constraints = RTCMediaConstraints(mandatoryConstraints: nil, optionalConstraints: nil)
        peerConnection = factory.peerConnection(with: configuration, constraints: constraints, delegate: self)

        let audioSource = factory.audioSource(with: nil)
        localAudioTrack = factory.audioTrack(with: audioSource, trackId: "audio0")

        let audioSender = peerConnection?.sender(withKind: kRTCMediaStreamTrackKindAudio, streamId: "stream0")
        audioSender?.track = localAudioTrack

        isActive = true

        // Signaling flow handled via SocketManagerService by emitting webrtc_offer/answer/candidate events.
    }

    func stopVoice() {
        localAudioTrack?.isEnabled = false
        peerConnection?.close()
        peerConnection = nil
        isActive = false
    }
}

extension WebRTCManager: RTCPeerConnectionDelegate {
    func peerConnection(_ peerConnection: RTCPeerConnection, didChange stateChanged: RTCSignalingState) {}
    func peerConnection(_ peerConnection: RTCPeerConnection, didAdd stream: RTCMediaStream) {}
    func peerConnection(_ peerConnection: RTCPeerConnection, didRemove stream: RTCMediaStream) {}
    func peerConnectionShouldNegotiate(_ peerConnection: RTCPeerConnection) {}
    func peerConnection(_ peerConnection: RTCPeerConnection, didChange newState: RTCIceConnectionState) {}
    func peerConnection(_ peerConnection: RTCPeerConnection, didChange newState: RTCIceGatheringState) {}
    func peerConnection(_ peerConnection: RTCPeerConnection, didGenerate candidate: RTCIceCandidate) {
        let payload: [String: Any] = [
            "gameId": "demo-game",
            "candidate": [
                "candidate": candidate.sdp,
                "sdpMid": candidate.sdpMid ?? "",
                "sdpMLineIndex": candidate.sdpMLineIndex
            ]
        ]
        SocketManagerService.shared.emit("webrtc_candidate", payload: payload)
    }
    func peerConnection(_ peerConnection: RTCPeerConnection, didRemove candidates: [RTCIceCandidate]) {}
}
