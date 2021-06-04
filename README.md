###### DTP Work Mobile

# Exprt release APK Android
> 1. Go to root project by Terminal.
> 2. Export by script: cd android && ./gradlew assembleReleas

# Run on Android device
> 1. Intasll all package libs by run: npm install
> 2. (Optional) Reset cache gradlew by run: cd android && ./gradlew clean && cd ..
> 3. (Optional) Reset cache node package by run: npm start -- --reset-cache
> 4. Run on Android device by run: npm run android