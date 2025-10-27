# SimTak iOS Client

SwiftUI application scaffold for the SimTak tactical platform.

## Project structure

```
ios/
└── SimTak/
    ├── AppDelegate.swift
    ├── SceneDelegate.swift
    ├── ContentView.swift
    ├── Models/
    │   └── DomainModels.swift
    ├── Services/
    │   ├── SocketManagerService.swift
    │   ├── LocationBroadcaster.swift
    │   └── WebRTCManager.swift
    └── Views/
        ├── LoginView.swift
        ├── GameListView.swift
        └── GameView.swift
```

## Requirements

* Xcode 15+
* Swift 5.9+
* Cocoapods or Swift Package Manager for `GoogleWebRTC`

## Setup

1. Open the folder in Xcode (`File > Open...`).
2. Add the GoogleWebRTC dependency (SPM: `https://github.com/google/ios-webrtc` or Cocoapods `pod 'GoogleWebRTC'`).
3. Update the Socket.IO endpoint in `SocketManagerService`.
4. Run on a physical device to validate audio capture/playback.

## Notes

* The code uses Combine to publish socket events to SwiftUI views.
* Security-sensitive code such as secure credential storage is intentionally omitted.
* See `docs/REALTIME_EVENTS.md` for the events mapped within the services.
