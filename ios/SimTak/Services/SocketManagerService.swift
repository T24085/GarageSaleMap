import Foundation
import Combine
import SocketIO

final class SocketManagerService: ObservableObject {
    static let shared = SocketManagerService()

    private var manager: SocketManager?
    private var socket: SocketIOClient?

    private let queue = DispatchQueue(label: "simtak.socket", qos: .userInitiated)

    @Published var latestLocations: [PlayerLocation] = []
    @Published var latestAnnotation: [String: Any] = [:]

    func connect(token: String) {
        guard let url = URL(string: Environment.serverURL) else { return }
        manager = SocketManager(socketURL: url, config: [.compress, .log(true), .extraHeaders(["Authorization": "Bearer \(token)"] )])
        socket = manager?.defaultSocket
        addHandlers()
        socket?.connect()
    }

    func disconnect() {
        socket?.disconnect()
        manager = nil
        socket = nil
    }

    func emit(_ event: String, payload: [String: Any]) {
        queue.async { [weak self] in
            self?.socket?.emit(event, payload)
        }
    }

    private func addHandlers() {
        socket?.on(clientEvent: .connect) { _, _ in
            print("[socket] connected")
        }

        socket?.on("player_location") { [weak self] data, _ in
            guard let locationData = data.first as? [String: Any],
                  let userId = locationData["userId"] as? String,
                  let lat = locationData["lat"] as? Double,
                  let lng = locationData["lng"] as? Double,
                  let heading = locationData["heading"] as? Double,
                  let timestampString = locationData["timestamp"] as? String,
                  let timestamp = ISO8601DateFormatter().date(from: timestampString) else { return }

            let location = PlayerLocation(id: userId, latitude: lat, longitude: lng, heading: heading, timestamp: timestamp)
            DispatchQueue.main.async {
                self?.latestLocations = [location]
            }
        }

        socket?.on("map_annot_created") { [weak self] data, _ in
            if let payload = data.first as? [String: Any] {
                DispatchQueue.main.async {
                    self?.latestAnnotation = payload
                }
            }
        }
    }
}
