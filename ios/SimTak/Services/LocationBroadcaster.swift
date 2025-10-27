import Foundation
import CoreLocation

final class LocationBroadcaster: NSObject, CLLocationManagerDelegate, ObservableObject {
    static let shared = LocationBroadcaster()

    private let manager = CLLocationManager()
    private let formatter = ISO8601DateFormatter()
    private var currentGameId: String?

    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBestForNavigation
        manager.requestWhenInUseAuthorization()
    }

    func start(gameId: String) {
        currentGameId = gameId
        manager.startUpdatingLocation()
    }

    func stop() {
        manager.stopUpdatingLocation()
        currentGameId = nil
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last, let gameId = currentGameId else { return }
        let payload: [String: Any] = [
            "gameId": gameId,
            "lat": location.coordinate.latitude,
            "lng": location.coordinate.longitude,
            "heading": location.course,
            "speed": location.speed,
            "timestamp": formatter.string(from: location.timestamp)
        ]
        SocketManagerService.shared.emit("location_update", payload: payload)
    }
}
