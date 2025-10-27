import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var session: SessionController
    @State private var username: String = ""
    @State private var errorMessage: String?

    var body: some View {
        VStack(spacing: 24) {
            Text("SimTak")
                .font(.largeTitle)
                .bold()

            VStack(alignment: .leading, spacing: 8) {
                Text("Callsign")
                    .font(.headline)
                TextField("RangerOne", text: $username)
                    .textFieldStyle(.roundedBorder)
            }

            if let message = errorMessage {
                Text(message)
                    .foregroundStyle(.red)
            }

            Button(action: login) {
                Text("Connect")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .disabled(username.isEmpty)
        }
        .padding()
    }

    private func login() {
        guard let url = URL(string: "\(Environment.serverURL)/auth/login") else {
            errorMessage = "Invalid server URL"
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONEncoder().encode(["username": username])

        URLSession.shared.dataTask(with: request) { data, _, error in
            if let error = error {
                DispatchQueue.main.async {
                    errorMessage = error.localizedDescription
                }
                return
            }

            guard let data = data,
                  let response = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let token = response["token"] as? String else {
                DispatchQueue.main.async {
                    errorMessage = "Failed to parse response"
                }
                return
            }

            DispatchQueue.main.async {
                session.updateToken(token)
                SocketManagerService.shared.connect(token: token)
            }
        }.resume()
    }
}
