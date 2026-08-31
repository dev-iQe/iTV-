import { API_BASE_URL, API_KEY, AUTH_HEADER_NAME } from "./config";

// دالة أساسية للطلبات، تضيف مفتاح الـ API تلقائيًا في كل طلب
async function request(path, params = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  
  // إضافة مفتاح الـ API تلقائياً مع كل طلب (TMDb يتطلب api_key في الـ query params إذا لم تستخدم الـ Bearer token)
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("language", "ar-SA"); // لجلب النتائج باللغة العربية إن أمكن

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`فشل الطلب (${response.status}): ${path}`);
  }
  return response.json();
}

// ===== الشكل المتوقع لكل عنصر (Movie/Series) بعد أي تحويل من API الشركة =====
export async function fetchMovies({ page = 1 } = {}) {
  // المسار الصحيح للأفلام الشائعة أو المستكشفة في TMDb
  const data = await request("/discover/movie", { page, sort_by: "popularity.desc" });
  return data.results || [];
}

export async function fetchSeries({ page = 1 } = {}) {
  // المسار الصحيح للمسلسلات في TMDb
  const data = await request("/discover/tv", { page, sort_by: "popularity.desc" });
  return data.results || [];
}

export async function fetchTitleDetails(id, type = "movie") {
  // type يحدد ما إذا كان فيلماً (movie) أو مسلسلاً (tv) لأن مسارات التفاصيل تختلف في TMDb
  return request(`/${type}/${id}`);
}

export async function searchTitles(query) {
  if (!query || query.trim().length === 0) return [];
  // مسار البحث الشامل في TMDb
  const data = await request("/search/multi", { query });
  return data.results || [];
}

// يرجع روابط التشغيل (ملاحظة: TMDb لا يوفر روابط مشاهدة مباشرة بالفيديو، بل يوفر بيانات الأفلام/المسلسلات فقط)
export async function fetchPlaybackSources(episodeOrMovieId) {
  // إذا كنت تستخدم مصدراً خارجيفياً للفيديو، يمكنك تعديل هذا الجزء، 
  // أما في TMDb يمكنك جلب الفيديوهات الترويجية (Trailers) مثلاً عبر مسار /movie/{id}/videos
  const data = await request(`/movie/${episodeOrMovieId}/videos`);
  return data;
}
