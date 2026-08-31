import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAppTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";

export default function FavoritesScreen({ navigation }) {
  const { theme } = useAppTheme();
  const { favorites } = useFavorites();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>المفضلة</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="heart-outline" size={40} color={theme.subtext} />
          <Text style={[styles.emptyText, { color: theme.subtext }]}>
            لم تُضِف أي فيلم أو مسلسل إلى المفضلة بعد
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("Details", { item })}
            >
              <Image source={{ uri: item.poster }} style={styles.poster} />
              <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 24, fontWeight: "800", textAlign: "right", padding: 16 },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingBottom: 80 },
  emptyText: { fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
  gridItem: { width: "31%", marginEnd: "3.5%", marginBottom: 16 },
  poster: { width: "100%", aspectRatio: 2 / 3, borderRadius: 10 },
  title: { fontSize: 12, marginTop: 6, textAlign: "right" },
});
