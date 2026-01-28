# Star Shooter V2 - Migration Walkthrough

## Overview
Due to persistent "Unknown Errors" in the Cloud Build environment tied to the previous monorepo structure and missing polyfills, we have **fully recreated the project from scratch** as `SpaceShooterV2`.

## Key Changes
1.  **Flat Architecture**: Switched to a standard `create-expo-app` structure to ensure EAS compatibility.
2.  **Explicit Polyfills**:
    -   Added `shim.js` with `react-native-get-random-values`, `text-encoding-polyfill`, etc.
    -   Configured `metro.config.js` to resolve `stream` and `crypto` for Ethers.js.
3.  **Clean Dependencies**: Installed `ethers@5.7.2`, `react-native-svg` and game libraries freshly.

## Validation
-   [x] **Foundation Build**: Verified empty project builds with polyfills.
-   [x] **Full Integration**: Verified game code (GameEngine, Shop, Web3) builds successfully locally (`npx expo export`).
-   [ ] **Cloud Build**: Ready for `eas build --platform android`.

## How to Deploy
1.  Navigate: `cd SpaceShooterV2`
2.  Run: `npx eas-cli build --platform android`
