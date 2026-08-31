import { API_BASE_URL, API_KEY, AUTH_HEADER_NAME } from "./config";

// دالة أساسية للطلبات، تضيف مفتاح الـ API تلقائيًا في كل طلب
async function request(path, params = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      [AUTH_HEADER_NAME]: API_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`فشل الطلب (${response.status}): ${path}`);
  }
  return response.json();
}

// ===== الشكل المتوقع لكل عنصر (Movie/Series) بعد أي تحويل من API الشركة =====
// {
//   id, title, poster, backdrop, rating, year, overview, type: "movie" | "series",
//   seasons: [{ id, name, episodes: [{ id, title, number, thumbnail, sources: [{quality, url}], subtitleUrl }] }]
// }

export async function fetchMovies({ page = 1 } = {}) {
  const data = await request("/movies", { page });
  return data.results || data.movies || data;
}

export async function fetchSeries({ page = 1 } = {}) {
  const data = await request("/series", { page });
  return data.results || data.series || data;
}

export async function fetchTitleDetails(id) {
  return request(`/titles/${id}`);
}

export async function searchTitles(query) {
  if (!query || query.trim().length === 0) return [];
  const data = await request("/search", { q: query });
  return data.results || data;
}

// يرجع روابط التشغيل حسب الجودة + رابط الترجمة العربية فقط لحلقة/فيلم معيّن
export async function fetchPlaybackSources(episodeOrMovieId) {
  const data = await request(`/playback/${episodeOrMovieId}`);
  // مثال للشكل المتوقع:
  // { sources: [{quality:"1080p", url:"..."}, {quality:"720p", url:"..."}], arabicSubtitleUrl: "..." }
  return data;
}
