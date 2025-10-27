// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "SimTak",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "SimTak",
            targets: ["SimTak"])
    ],
    targets: [
        .target(
            name: "SimTak",
            path: "SimTak"
        )
    ]
)
