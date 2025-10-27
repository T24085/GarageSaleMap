import Foundation

enum Environment {
    static let serverURL: String = Bundle.main.object(forInfoDictionaryKey: "SIMTAK_SERVER_URL") as? String ?? "http://localhost:4000"
}
