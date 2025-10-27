import SwiftUI

struct GameListView: View {
    @EnvironmentObject private var session: SessionController
    @State private var isLoading = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            List(session.games) { game in
                NavigationLink(destination: GameView(game: game)) {
                    VStack(alignment: .leading) {
                        Text(game.name)
                            .font(.headline)
                        Text(game.isRunning ? "Active" : "Standby")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("Games")
            .toolbar {
                Button(action: fetchGames) {
                    if isLoading {
                        ProgressView()
                    } else {
                        Image(systemName: "arrow.clockwise")
                    }
                }
            }
            .alert("Error", isPresented: .constant(errorMessage != nil)) {
                Button("Dismiss", role: .cancel) {
                    errorMessage = nil
                }
            } message: {
                Text(errorMessage ?? "Unknown error")
            }
            .task {
                await fetchGames()
            }
        }
    }

    @Sendable private func fetchGames() async {
        guard let url = URL(string: "\(Environment.serverURL)/games") else { return }
        isLoading = true
        defer { isLoading = false }

        var request = URLRequest(url: url)
        request.addValue("Bearer \(session.token)", forHTTPHeaderField: "Authorization")

        do {
            let (data, _) = try await URLSession.shared.data(for: request)
            let games = try JSONDecoder().decode([Game].self, from: data)
            session.games = games
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
