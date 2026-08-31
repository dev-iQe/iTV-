import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAppTheme } from "../context/ThemeContext";
import SectionRow from "../components/SectionRow";
import { fetchMovies, fetchSeries } from "../api/client";
import { USE_MOCK } from "../api/config";
import { MOCK_MOVIES, MOCK_SERIES } from "../api/mockData";

export default function HomeScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [tab, setTab] = useState("movies"); // movies | series
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      if (USE_MOCK) {
        setMovies(MOCK_MOVIES);
        setSeries(MOCK_SERIES);
      } else {
        const [m, s] = await Promise.all([fetchMovies(), fetchSeries()]);
        setMovies(m);
        setSeries(s);
      }
    } catch (e) {
      console.warn("تعذّر جلب البيانات:", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeList = tab === "movies" ? movies : series;
  const featured = activeList[0];

  const openDetails = (item) => navigation.navigate("Details", { item });

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
          tintColor={theme.accent}
        />
      }
    >
      {featured && (
        <TouchableOpacity activeOpacity={0.9} onPress={() => openDetails(featured)}>
          <View style={styles.hero}>
            <Image source={{ uri: featured.backdrop }} style={styles.heroImage} />
            <LinearGradient
              colors={["transparent", theme.background]}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <Text style={[styles.heroTitle, { color: theme.text }]}>{featured.title}</Text>
              <View style={styles.heroMetaRow}>
                <Ionicons name="star" size={14} color="#FFD166" />
                <Text style={[styles.heroMeta, { color: theme.subtext }]}>
                  {featured.rating}  ·  {featured.year}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.segmentWrap}>
        <View style={[styles.segment, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={[styles.segmentBtn, tab === "movies" && { backgroundColor: theme.accent }]}
            onPress={() => setTab("movies")}
          >
            <Text style={[styles.segmentText, { color: tab === "movies" ? "#fff" : theme.subtext }]}>
              أفلام
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, tab === "series" && { backgroundColor: theme.accent }]}
            onPress={() => setTab("series")}
          >
            <Text style={[styles.segmentText, { color: tab === "series" ? "#fff" : theme.subtext }]}>
              مسلسلات
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <SectionRow
        title={tab === "movies" ? "الأكثر مشاهدة" : "مسلسلات رائجة"}
        data={activeList}
        onPressItem={openDetails}
      />
      <SectionRow
        title="أُضيف حديثًا"
        data={[...activeList].reverse()}
        onPressItem={openDetails}
      />

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: { width: "100%", aspectRatio: 12 / 15, justifyContent: "flex-end" },
  heroImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  heroGradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: "60%" },
  heroContent: { padding: 20 },
  heroTitle: { fontSize: 28, fontWeight: "800", textAlign: "right" },
  heroMetaRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6, marginTop: 6 },
  heroMeta: { fontSize: 14 },
  segmentWrap: { paddingHorizontal: 16, marginTop: 14, marginBottom: 6 },
  segment: {
    flexDirection: "row-reverse",
    borderRadius: 12,
    padding: 4,
  },
  segmentBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: "center" },
  segmentText: { fontWeight: "700", fontSize: 14 },
});
