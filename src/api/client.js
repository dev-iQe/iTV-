import { API_BASE_URL, API_KEY, AUTH_HEADER_NAME } from "./config";

// دالة أساسية للطلبات
async function request(path, params = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("language", "ar-SA"); // لجلب النتائج بالعربي

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

// دالة مساعد لتحويل عنصر TMDb إلى الشكل الموحّد للتطبيق
function formatItem(item, type = "movie") {
  return {
    id: item.id,
    title: item.title || item.name,
    poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
    rating: item.vote_average,
    year: (item.release_date || item.first_air_date || "").split("-")[0],
    overview: item.overview,
    type: item.media_type || type,
  };
}

export async function fetchMovies({ page = 1 } = {}) {
  const data = await request("/discover/movie", { page, sort_by: "popularity.desc" });
  const results = data.results || [];
  return results.map(movie => formatItem(movie, "movie"));
}

export async function fetchSeries({ page = 1 } = {}) {
  const data = await request("/discover/tv", { page, sort_by: "popularity.desc" });
  const results = data.results || [];
  return results.map(tv => formatItem(tv, "series"));
}

export async function fetchTitleDetails(id, type = "movie") {
  const data = await request(`/${type}/${id}`);
  return {
    ...formatItem(data, type),
    genres: data.genres ? data.genres.map(g => g.name) : [],
    runtime: data.runtime || data.episode_run_time?.[0],
  };
}

export async function searchTitles(query) {
  if (!query || query.trim().length === 0) return [];
  const data = await request("/search/multi", { query });
  const results = data.results || [];
  // تصفية النتائج لتكون أفلام أو مسلسلات فقط
  return results
    .filter(item => item.media_type === "movie" || item.media_type === "tv")
    .map(item => formatItem(item, item.media_type === "tv" ? "series" : "movie"));
}

// TMDb لا يوفر روابط مشاهدة مباشرة، لذا نجلب الفيديوهات الترويجية (Trailers) كمثال
export async function fetchPlaybackSources(id, type = "movie") {
  const data = await request(`/${type}/${id}/videos`);
  const trailer = data.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  
  return {
    sources: trailer ? [{ quality: "1080p", url: `https://www.youtube.com/watch?v=${trailer.key}` }] : [],
    arabicSubtitleUrl: null,
  };
}
