# تطبيق الأفلام (Movie App) — React Native خالص (بدون Expo)

تطبيق أفلام ومسلسلات بواجهة تشبه Apple TV، مبني بـ **React Native CLI** (بدون أي اعتماد على Expo أو حسابات/توكن خارجية)، يجلب البيانات مباشرة عبر API Key، بدون أي صفحات تسجيل دخول.

---

## 1. المزايا

- الرئيسية: أقسام أفلام/مسلسلات + شريط عرض مميز.
- زر بحث في شريط التبويبات السفلي (مثل Apple TV).
- مفضلة محفوظة محليًا على الجهاز (بدون حساب أو تسجيل دخول).
- صفحة تفاصيل: بوستر، تقييم، قصة، أجزاء، حلقات.
- مشغل فيديو مبني على `react-native-video`:
  - تبديل الجودة يدويًا (1080p / 720p / 480p...).
  - ترجمة عربية فقط، تفعيل/إيقاف بضغطة زر (عبر `textTracks`).
  - Picture in Picture على iOS، تشغيل في الخلفية.
  - شريط تقدّم، تقديم/تأخير 10 ثوانٍ.
- إعدادات داكن/فاتح محفوظة تلقائيًا.
- صفحة "عن المطوّر".
- **لا توجد أي صفحة تسجيل دخول أو حسابات مستخدمين** — التطبيق يعرض المحتوى مباشرة عبر مفتاح API واحد مضبوط داخل الكود.

---

## 2. ربط API الشركة

- `src/api/config.js`:
  - `API_BASE_URL` → رابط API الشركة.
  - `API_KEY` → مفتاحك (موجود بالفعل).
  - `USE_MOCK` → اجعلها `false` بعد ضبط الرابط (حاليًا `true` لعرض بيانات تجريبية للمعاينة).
- `src/api/client.js`: عدّل مسارات الطلبات لتطابق توثيق API الشركة.

---

## 3. لماذا لا يوجد مجلدا ios/ و android/؟

React Native (بخلاف Expo) يحتاج مشروعًا أصليًا (Native) فعليًا لكل منصة (مجلد `ios/` بمشروع Xcode، ومجلد `android/` بمشروع Gradle). هذه المجلدات **يجب توليدها مرة واحدة** عبر أمر يحتاج اتصال إنترنت فعليًا لتحميل القوالب الأصلية — وهذا غير ممكن من هنا مباشرة، لكنه بسيط جدًا من نفس الـ Codespaces الذي تعمل عليه الآن (وفيه إنترنت كامل).

### التوليد (مرة واحدة فقط)

نفّذ هذا داخل الطرفية في Codespaces، من المجلد الرئيسي لمشروعك (حيث `package.json`):

```
npx react-native@0.74.5 init TempNative --version 0.74.5 --skip-install --pm npm
```

بعد انتهائه ستجد مجلدًا جديدًا اسمه `TempNative` بجانب مشروعك، فيه `ios/` و `android/` جاهزتان. انقلهما لمشروعك الأصلي:

```
mv TempNative/ios ./ios
mv TempNative/android ./android
rm -rf TempNative
```

ثم افتح `ios/TempNative.xcodeproj` بحثًا عن كل ما فيه اسم `TempNative` واستبدله باسم مشروعك `MovieApp` (أسهل طريقة: أمر بحث واستبدال داخل الملفات النصية فقط، وليس داخل ملفات ثنائية):

```
grep -rl "TempNative" ios --include="*.pbxproj" --include="*.plist" --include="*.xcscheme" | xargs sed -i 's/TempNative/MovieApp/g'
```

وأعد تسمية المجلدات والملفات المطابقة إن وُجدت (`TempNative.xcodeproj` → `MovieApp.xcodeproj` وهكذا). هذه خطوة تحتاج تركيزًا بسيطًا؛ إن واجهتك مشكلة أرسل لي لقطة شاشة من محتوى `ios/` وسأدلّك بدقة.

بعدها ثبّت الحزم واربط مكتبات iOS الأصلية:

```
npm install
cd ios && pod install && cd ..
```

(يتطلب `pod install` بيئة macOS — لهذا سنجعل GitHub Actions ينفّذها تلقائيًا على خادم Mac مجاني، كما بالخطوة التالية.)

احفظ كل شيء وارفعه:

```
git add .
git commit -m "إضافة مشروع iOS الأصلي"
git push
```

---

## 4. بناء IPA عبر GitHub Actions (خادم Mac، بدون أي حساب Expo)

أضف هذا الملف في `.github/workflows/build-ios.yml` (أنشئه من المستكشف: زر يمين على `.github` → إن لم يكن مجلد `workflows` موجودًا أنشئه أولاً):

```yaml
name: Build iOS IPA

on:
  workflow_dispatch:
  push:
    branches: [main]

jobs:
  build:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install JS dependencies
        run: npm install

      - name: Install CocoaPods
        run: cd ios && pod install && cd ..

      - name: Build unsigned .app (archive بدون توقيع)
        run: |
          xcodebuild -workspace ios/MovieApp.xcworkspace \
            -scheme MovieApp \
            -configuration Release \
            -sdk iphoneos \
            -derivedDataPath build \
            CODE_SIGNING_ALLOWED=NO \
            build

      - name: Package as IPA
        run: |
          mkdir -p Payload
          cp -r build/Build/Products/Release-iphoneos/MovieApp.app Payload/
          zip -r MovieApp.ipa Payload

      - name: Upload IPA
        uses: actions/upload-artifact@v4
        with:
          name: app-ipa
          path: MovieApp.ipa
```

هذا يبني على خادم **macOS حقيقي مجاني من GitHub** (بدون أي حساب Expo أو أي خدمة خارجية)، وينتج IPA **غير موقّع بالكامل** — وهذا هو الشكل الأنسب لتمريره مباشرة إلى **esign** لأنه يعيد توقيعه بالكامل من جهازك بأي حال.

بعد أول Push، تابع تبويب **Actions** في مستودعك، وحمّل `app-ipa` من قسم Artifacts عند الانتهاء.

---

## 5. التوقيع والتثبيت عبر esign

1. حمّل `MovieApp.ipa` على آيفونك.
2. افتح **esign** وسجّل دخولك بمعرّف Apple.
3. استورد الـ IPA → **Resign** → اختر شهادتك → **Install**.
4. الإعدادات ← عام ← إدارة VPN وإدارة الجهاز ← ثِق بحساب المطوّر.

---

## 6. تخصيص الهوية

- الاسم: `app.json` (`name`, `displayName`) + داخل `ios/MovieApp.xcodeproj` (بعد التوليد).
- الألوان: `src/theme/colors.js`.
- بيانات المطوّر: `src/screens/DeveloperScreen.js`.
