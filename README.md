# Trip-Wallet

### 1.0.8
- status bar 높이 수정
### 1.0.7
- 지도 화면에서 Component 클릭시, 지도에 연동해 표시
- Map 화면에서 비용 클릭시, 수정 삭제 없이 지도상 위치 표시하도록 수정
### 1.0.6
- 마이너스 금액 입력 가능하도록 수정
- 최근 사용중인 여행기록이 있으면, 앱 구동과 동시에 이동

## build command
```bash
$ expo build:android 
```

## android permissions
    ```json
    {
        "android": {
            "permissions": [
                "ACCESS_COARSE_LOCATION",
                "ACCESS_FINE_LOCATION",
                "READ_INTERNAL_STORAGE",
                "READ_EXTERNAL_STORAGE",
                "WRITE_EXTERNAL_STORAGE"  
            ],
        },
    }
    ```

## [App Privacy Policy Generator](https://app-privacy-policy-generator.firebaseapp.com/#)

## Icon & Splash
- 512x512 고해상도 아이콘 (앱 아이콘)
- 1024x500 그래픽 이미지
- 1242x2436 Splash 이미지

## Sqlite
- [Data types](https://sqlite.org/datatype3.html)

## Expo android permissions
- [https://docs.expo.io/versions/latest/workflow/configuration/#android](https://docs.expo.io/versions/latest/workflow/configuration/#android)

## Image
- [Expo - ImagePicker](https://docs.expo.io/versions/v28.0.0/sdk/imagepicker/)
- [Expo - ImageManipulator](https://docs.expo.io/versions/v28.0.0/sdk/imagemanipulator/)

## Android Datepicker
- [Expo - DatePickerAndroid](https://docs.expo.io/versions/latest/react-native/datepickerandroid/#open)

## MapView
- [Expo - MapView](https://docs.expo.io/versions/latest/sdk/map-view/)
- [Google APIs for Android - MapView](https://developers.google.com/android/reference/com/google/android/gms/maps/MapView)

## 참고
- [React Navigation - Routing and navigation for your React Native apps](https://reactnavigation.org/)
- [Expo Icons](https://expo.github.io/vector-icons/)