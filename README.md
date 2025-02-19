# Multi-View Browser

A modern mobile application that enables users to browse multiple web pages simultaneously in a seamless interface.

## Features

- Multiple web views in a single screen
- Easy navigation between different web pages
- Customizable layout options
- Responsive design for various screen sizes
- Cross-platform support (iOS and Android)

## Download

Get the latest version of Multi-View Browser:
[![Download APK](https://img.shields.io/github/v/release/kehhhh/multi-view-browser?label=Download&logo=android)](https://github.com/kehhhh/multi-view-browser/releases/latest)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kehhhh/multi-view-browser.git
cd multi-view-browser
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Running the App

- For iOS:
```bash
npm run ios
```

- For Android:
```bash
npm run android
```

## Development Requirements

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio and Android SDK (for Android development)

## Building and Releasing

### Building the APK

1. Install the latest EAS CLI:
```bash
npm install -g eas-cli
```
2. Build the APK using EAS:
```bash
eas build -p android --profile preview
```

### Releasing on GitHub

1. Go to your repository's Releases page
2. Click "Create a new release"
3. Tag version (e.g., v1.0.0)
4. Title the release (e.g., "Version 1.0.0")
5. Add release notes describing the changes
6. Upload the generated APK file
7. Mark as pre-release if needed
8. Click "Publish release"

Note: Make sure to sign your APK before release. You can configure signing in `eas.json`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/kehhhh/multi-view-browser/issues) page
2. Create a new issue if your problem isn't already listed

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Built with [Expo](https://expo.dev/) and React Native 
