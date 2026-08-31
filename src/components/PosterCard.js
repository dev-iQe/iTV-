import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAppTheme } from "../context/ThemeContext";

export default function PosterCard({ item, onPress, width = 120 }) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={{ width, marginEnd: 12 }}>
      <View style={[styles.posterWrap, { backgroundColor: theme.surface }]}>
        <Image source={{ uri: item.poster }} style={styles.poster} resizeMode="cover" />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={11} color="#FFD166" />
          <Text style={styles.ratingText}>{item.rating?.toFixed(1) ?? "—"}</Text>
        </View>
      </View>
      <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  posterWrap: {
    borderRadius: 12,
    overflow: "hidden",
    aspectRatio: 2 / 3,
  },
  poster: { width: "100%", height: "100%" },
  ratingBadge: {
    position: "absolute",
    top: 6,
    insetInlineEnd: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  title: { marginTop: 6, fontSize: 13, fontWeight: "600", textAlign: "right" },
});
