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
4. Run develop build on Android device:
> ***npm run android-debug-develop***
5. Run prod build on Android device:
> ***npm run android-debug-product***

### Run on iOS device
1. Intasll all package libs:
> ***npm install***
2. Install all cocoapods:
> ***npx pod-install***
3. (Optional) Reset cache node package:
> ***npm start -- --reset-cache***
4. Run develop build on iOS device:
> ***npm run ios-debug-develop***
5. Run prod build on iOS device:
> ***npm run ios-debug-production***