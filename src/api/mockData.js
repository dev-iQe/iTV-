// بيانات تجريبية فقط لتشغيل التطبيق وتصميمه قبل ربط API الشركة الحقيقي.
// عند تجهيز الـ API الحقيقي، بدّل USE_MOCK إلى false في config.js واحذف الاعتماد على هذا الملف.

export const MOCK_MOVIES = [
  {
    id: "m1",
    type: "movie",
    title: "حافة الغد",
    poster: "https://picsum.photos/seed/m1/400/600",
    backdrop: "https://picsum.photos/seed/m1b/1200/700",
    rating: 8.1,
    year: 2023,
    overview: "بعد حادثة غامضة، يجد بطل القصة نفسه عالقًا في حلقة زمنية يجب أن يفهمها قبل فوات الأوان.",
    sources: [
      { quality: "1080p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { quality: "720p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { quality: "480p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
    ],
    arabicSubtitleUrl: null,
  },
  {
    id: "m2",
    type: "movie",
    title: "ظلال المدينة",
    poster: "https://picsum.photos/seed/m2/400/600",
    backdrop: "https://picsum.photos/seed/m2b/1200/700",
    rating: 7.4,
    year: 2022,
    overview: "محقق يطارد شبكة إجرامية تتحكم في المدينة من الظل.",
    sources: [
      { quality: "1080p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { quality: "720p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
    ],
    arabicSubtitleUrl: null,
  },
];

export const MOCK_SERIES = [
  {
    id: "s1",
    type: "series",
    title: "أرض الوعود",
    poster: "https://picsum.photos/seed/s1/400/600",
    backdrop: "https://picsum.photos/seed/s1b/1200/700",
    rating: 8.7,
    year: 2021,
    overview: "قصة عائلة تحاول النجاة والنهوض من جديد وسط ظروف قاسية.",
    seasons: [
      {
        id: "s1-season1",
        name: "الموسم الأول",
        episodes: [
          {
            id: "s1-e1",
            title: "الحلقة 1: البداية",
            number: 1,
            thumbnail: "https://picsum.photos/seed/s1e1/500/280",
            sources: [
              { quality: "1080p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
              { quality: "720p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
            ],
            arabicSubtitleUrl: null,
          },
          {
            id: "s1-e2",
            title: "الحلقة 2: القرار",
            number: 2,
            thumbnail: "https://picsum.photos/seed/s1e2/500/280",
            sources: [
              { quality: "1080p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
              { quality: "720p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
            ],
            arabicSubtitleUrl: null,
          },
        ],
      },
    ],
  },
];
