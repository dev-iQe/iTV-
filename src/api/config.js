// =====================================================================
// عدّل هذا الملف فقط لربط التطبيق بموقع الشركة الحقيقي
// =====================================================================

// رابط الـ API الخاص بالشركة (بدون / في النهاية)
export const API_BASE_URL = "https://api.themoviedb.org/3";

// مفتاح الـ API المرخّص من الشركة
export const API_KEY = "12bae60f08973cb30c741d0844769d9d";

// كيف يُرسل المفتاح: كهيدر أو كـ query param. عدّل حسب توثيق الشركة
export const AUTH_HEADER_NAME = "Authorization";

// اجعلها false بعد ربط API الشركة الحقيقي في fetchMovies/fetchSeries داخل client.js
export const USE_MOCK = false;
