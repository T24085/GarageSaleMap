import Foundation
import Combine

struct Game: Identifiable, Codable {
    let id: String
    let name: String
    let isRunning: Bool
}

struct PlayerLocation: Identifiable {
    let id: String
    let latitude: Double
    let longitude: Double
    let heading: Double
    let timestamp: Date
}

final class SessionController: ObservableObject {
    @Published var isAuthenticated = false
    @Published var token: String = ""
    @Published var games: [Game] = []

    func updateToken(_ newToken: String) {
        token = newToken
        isAuthenticated = !newToken.isEmpty
    }
}
