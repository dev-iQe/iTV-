import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import PosterCard from "./PosterCard";

export default function SectionRow({ title, data, onPressItem }) {
  const { theme } = useAppTheme();
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        inverted
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <PosterCard item={item} onPress={() => onPressItem(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 22 },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginHorizontal: 16,
    textAlign: "right",
  },
});
