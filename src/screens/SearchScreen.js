import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAppTheme } from "../context/ThemeContext";
import { USE_MOCK } from "../api/config";
import { MOCK_MOVIES, MOCK_SERIES } from "../api/mockData";
import { searchTitles } from "../api/client";

export default function SearchScreen({ navigation }) {
  const { theme } = useAppTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const allMock = useMemo(() => [...MOCK_MOVIES, ...MOCK_SERIES], []);

  const onChangeQuery = async (text) => {
    setQuery(text);
    if (text.trim().length === 0) {
      setResults([]);
      return;
    }
    if (USE_MOCK) {
      setResults(
        allMock.filter((item) => item.title.toLowerCase().includes(text.toLowerCase()))
      );
    } else {
      try {
        const r = await searchTitles(text);
        setResults(r);
      } catch (e) {
        setResults([]);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
        <Ionicons name="search" size={18} color={theme.subtext} />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="ابحث عن فيلم أو مسلسل"
          placeholderTextColor={theme.subtext}
          style={[styles.input, { color: theme.text }]}
          textAlign="right"
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => onChangeQuery("")}>
            <Ionicons name="close-circle" size={18} color={theme.subtext} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          query.length > 0 ? (
            <Text style={[styles.empty, { color: theme.subtext }]}>لا توجد نتائج مطابقة</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultRow}
            onPress={() => navigation.navigate("Details", { item })}
          >
            <Image source={{ uri: item.poster }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.resultTitle, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.resultMeta, { color: theme.subtext }]}>
                {item.type === "movie" ? "فيلم" : "مسلسل"} · {item.year}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: { flex: 1, fontSize: 15 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 14 },
  resultRow: { flexDirection: "row-reverse", gap: 12, marginBottom: 16, alignItems: "center" },
  thumb: { width: 60, height: 90, borderRadius: 8 },
  resultTitle: { fontSize: 15, fontWeight: "700", textAlign: "right" },
  resultMeta: { fontSize: 12, marginTop: 4, textAlign: "right" },
});
