import SwiftUI
import MapKit

struct GameView: View {
    let game: Game
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 29.7604, longitude: -95.3698),
        span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
    )
    @State private var trackedLocations: [PlayerLocation] = []

    var body: some View {
        VStack {
            Map(coordinateRegion: $region, annotationItems: trackedLocations) { location in
                MapMarker(coordinate: CLLocationCoordinate2D(latitude: location.latitude, longitude: location.longitude), tint: .orange)
            }
            .onReceive(SocketManagerService.shared.$latestLocations) { locations in
                trackedLocations = locations
            }
            .task {
                SocketManagerService.shared.emit("join_game", payload: [
                    "gameId": game.id,
                    "userId": "ios-client"
                ])
                LocationBroadcaster.shared.start(gameId: game.id)
            }
            .onDisappear {
                SocketManagerService.shared.emit("leave_game", payload: [
                    "gameId": game.id,
                    "userId": "ios-client"
                ])
                LocationBroadcaster.shared.stop()
            }

            Button("Drop Marker") {
                SocketManagerService.shared.emit("map_annot_create", payload: [
                    "gameId": game.id,
                    "annotation": [
                        "type": "marker",
                        "geometry": [
                            "lat": region.center.latitude,
                            "lng": region.center.longitude
                        ],
                        "properties": [
                            "label": "Ping from iOS",
                            "createdAt": ISO8601DateFormatter().string(from: Date())
                        ]
                    ]
                ])
            }
            .buttonStyle(.bordered)
            .padding()
        }
        .navigationTitle(game.name)
        .navigationBarTitleDisplayMode(.inline)
    }
}
