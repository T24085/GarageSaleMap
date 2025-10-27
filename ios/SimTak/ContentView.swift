import SwiftUI

struct ContentView: View {
    @StateObject private var session = SessionController()

    var body: some View {
        if session.isAuthenticated {
            GameListView()
                .environmentObject(session)
        } else {
            LoginView()
                .environmentObject(session)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
