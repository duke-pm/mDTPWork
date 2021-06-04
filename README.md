# DTP Work Mobile

### Export release APK Android
1. Go to root project by Terminal.
2. Export by script:
> ***cd android && ./gradlew assembleRelease***

### Run on Android device
1. Intasll all package libs:
> ***npm install***
2. (Optional) Reset cache gradlew:
> ***cd android && ./gradlew clean && cd ***
3. (Optional) Reset cache node package:
> ***npm start -- --reset-cache***
4. Run on Android device:
> ***npm run android***

### Run on iOS device
1. Intasll all package libs:
> ***npm install***
2. Install all cocoapods:
> ***npx pod-install***
3. (Optional) Reset cache node package:
> ***npm start -- --reset-cache***
4. Run on Android device:
> ***npm run ios***
  4. Or if you want run on other device, just replace @ to any device you want
  > ***react-native run-ios --simulator="iPhone @"***