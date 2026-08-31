import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAppTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";

export default function DetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const { theme } = useAppTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeSeason, setActiveSeason] = useState(item.seasons ? item.seasons[0] : null);

  const fav = isFavorite(item.id);

  const playEpisode = (episode) => {
    navigation.navigate("Player", {
      title: episode ? episode.title : item.title,
      sources: episode ? episode.sources : item.sources,
      arabicSubtitleUrl: episode ? episode.arabicSubtitleUrl : item.arabicSubtitleUrl,
    });
  };

  return (
    <ScrollView style={{ backgroundColor: theme.background }} showsVerticalScrollIndicator={false}>
      <View style={styles.backdropWrap}>
        <Image source={{ uri: item.backdrop || item.poster }} style={styles.backdrop} />
        <LinearGradient colors={["transparent", theme.background]} style={styles.gradient} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Image source={{ uri: item.poster }} style={styles.poster} />
          <View style={styles.headerInfo}>
            <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="star" size={14} color="#FFD166" />
              <Text style={[styles.metaText, { color: theme.subtext }]}>
                {item.rating} · {item.year} · {item.type === "movie" ? "فيلم" : "مسلسل"}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.favBtn, { borderColor: theme.accent }]}
              onPress={() => toggleFavorite(item)}
            >
              <Ionicons
                name={fav ? "heart" : "heart-outline"}
                size={16}
                color={theme.accent}
              />
              <Text style={[styles.favText, { color: theme.accent }]}>
                {fav ? "في المفضلة" : "أضِف للمفضلة"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {item.type === "movie" ? (
          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: theme.accent }]}
            onPress={() => playEpisode(null)}
          >
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={styles.playText}>تشغيل الفيلم</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={[styles.overview, { color: theme.text }]}>{item.overview}</Text>

        {item.type === "series" && item.seasons && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>الأجزاء</Text>
            <FlatList
              data={item.seasons}
              keyExtractor={(s) => s.id}
              horizontal
              inverted
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 4 }}
              renderItem={({ item: season }) => (
                <TouchableOpacity
                  onPress={() => setActiveSeason(season)}
                  style={[
                    styles.seasonChip,
                    {
                      backgroundColor:
                        activeSeason?.id === season.id ? theme.accent : theme.surface,
                      marginEnd: 10,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: activeSeason?.id === season.id ? "#fff" : theme.text,
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    {season.name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <Text style={[styles.sectionTitle, { color: theme.text }]}>الحلقات</Text>
            {activeSeason?.episodes.map((ep) => (
              <TouchableOpacity
                key={ep.id}
                style={styles.episodeRow}
                onPress={() => playEpisode(ep)}
              >
                <Image source={{ uri: ep.thumbnail }} style={styles.episodeThumb} />
                <View style={styles.playOverlay}>
                  <Ionicons name="play-circle" size={26} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.episodeTitle, { color: theme.text }]}>{ep.title}</Text>
                  <Text style={[styles.episodeNumber, { color: theme.subtext }]}>
                    الحلقة {ep.number}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backdropWrap: { width: "100%", aspectRatio: 16 / 9 },
  backdrop: { width: "100%", height: "100%" },
  gradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: "70%" },
  backBtn: {
    position: "absolute",
    top: 50,
    insetInlineStart: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
  body: { paddingHorizontal: 16, marginTop: -40 },
  headerRow: { flexDirection: "row-reverse", gap: 14 },
  poster: { width: 100, height: 150, borderRadius: 10 },
  headerInfo: { flex: 1, justifyContent: "flex-end" },
  title: { fontSize: 20, fontWeight: "800", textAlign: "right" },
  metaRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6, marginTop: 6 },
  metaText: { fontSize: 13 },
  favBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  favText: { fontSize: 12, fontWeight: "700" },
  playBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 18,
  },
  playText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  overview: { marginTop: 16, fontSize: 14, lineHeight: 22, textAlign: "right" },
  sectionTitle: { fontSize: 17, fontWeight: "800", marginTop: 22, marginBottom: 10, textAlign: "right" },
  seasonChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  episodeRow: { flexDirection: "row-reverse", gap: 12, marginBottom: 14, alignItems: "center" },
  episodeThumb: { width: 130, height: 74, borderRadius: 8 },
  playOverlay: {
    position: "absolute",
    insetInlineEnd: 40,
    top: 24,
  },
  episodeTitle: { fontSize: 14, fontWeight: "700", textAlign: "right" },
  episodeNumber: { fontSize: 12, marginTop: 4, textAlign: "right" },
});
